import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { normalizeJsonLd } from '../../linkedData'
import { JsonLdObject } from '@jolocom/protocol-ts'
import { Identity } from '../../identity/identity'
import { verifySignatureWithIdentity } from '../../utils/validation'
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..'
import { base64url } from 'rfc4648'
import { dateToIsoString } from '../../credentials/v1.1/util'

/**
 * @class A Ed25519Signature2018 Linked Data Proof implementation
 * {@see https://w3c-ccg.github.io/lds-ed25519-2018/}
 */

@Exclude()
export class Ed25519Signature2018<
  T extends BaseProofOptions
> extends LinkedDataProof<T> {
  private encodedJWTHeader =
    'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19'
  proofType = SupportedSuites.Ed25519Signature2018

  signatureSuite = {
    hashFn: sha256,
    normalizeFn: async (doc: JsonLdObject) => {
      return await normalizeJsonLd(doc, defaultContext)
    },
    encodeSignature: (signature: Buffer) => {
      return (
        this.encodedJWTHeader +
        '..' +
        base64url.stringify(signature, { pad: false })
      )
    },
    decodeSignature: (jws: string) => {
      const [_, signature] = jws.split('..')
      return Buffer.from(
        base64url.parse(signature, {
          loose: true,
        })
      )
    },
  }

  /**
   * Get /set the proofPurpose field
   * @example `console.log(proof.proofPurpose) // 'assertionMethod'`
   */

  @Expose()
  get proofPurpose() {
    return this._proofPurpose
  }

  set proofPurpose(proofPurpose: string) {
    this._proofPurpose = proofPurpose
  }

  /**
   * Get / set the expiry date for the linked data signature
   * @example `console.log(proof.created) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  @Transform(({ value }) => dateToIsoString(value), {
    toPlainOnly: true,
  })
  get created() {
    return this._created
  }

  set created(created: Date) {
    this._created = created
  }

  /**
   * Get the type of the linked data signature
   * @example `console.log(proof.type) // 'Ed25519Signature2018'`
   */

  @Expose()
  get type() {
    return this.proofType
  }

  /**
   * Get / set the hex encoded signature value
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose()
  get jws() {
    return this._proofValue
  }

  set jws(signature: string) {
    this._proofValue = signature
  }

  /**
   * Set the identifier of the public signing key
   * @example `proof.creator = 'did:jolo:...#keys-1`
   */

  @Expose()
  get verificationMethod() {
    return this._verificationMethod
  }

  set verificationMethod(verificationMethod: string) {
    this._verificationMethod = verificationMethod
  }

  /**
   * Static method to instantiate a (minimally configured) LD Proof instance
   * @param args - metadata related to the proof {@link BaseProofOptions}
   * @returns - new instance of a {@link Ed25519Signature2018}
   */

  static create(arg: BaseProofOptions) {
    const cp = new Ed25519Signature2018()
    cp.verificationMethod = arg.verificationMethod
    cp.created = arg.created || new Date()
    cp._proofPurpose = arg.proofPurpose || 'assertionMethod'

    return cp as LinkedDataProof<BaseProofOptions>
  }

  /**
   * Will derive a new instance of a Ed25519Signature2018 proof, populate all relevant fields and
   * generate the associated signature.
   * @param inputs - The document to be signed, including existing proof nodes
   * @param customProofOptions  - no custom options are expected / used for this proof type
   * @param signer - Insance of IdentityWalle which can be used to generate a signature
   * @param pass - Password for using the keys managed by the IdentityWallet
   * @returns - new instance of a {@link Ed25519Signature2018} proof
   */

  async derive(
    inputs: ProofDerivationOptions,
    proofSpecificOptions: {},
    signer: IdentityWallet,
    pass: string
  ) {
    if (!this.verificationMethod || !this.created) {
      throw new Error('Proof options not set')
    }

    if (this.verificationMethod !== signer.publicKeyMetadata.signingKeyId) {
      throw new Error(
        `No signer for referenced verificationMethod ${this.verificationMethod}`
      )
    }

    const documentDigest = await this.createVerifyHash(inputs.document)

    const toSign = Buffer.concat([
      Buffer.from(this.encodedJWTHeader + '.', 'utf8'),
      documentDigest,
    ])

    this.jws = this.signatureSuite.encodeSignature(
      await signer.sign(toSign, pass)
    )
    return this
  }

  /**
   * Will attempt to verify the signature included in the LD Proof instance.
   * @param inputs - The document to be verified, including existing proof nodes.
   * @param signer - An {@link Identity} instance expected to hold the appropriate public keys.
   * to verify the signature (i.e. must hold the required verificationMethod).
   * @returns {Promise<boolean>} - boolean signalling if the signature is correct or not.
   */

  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const digest = await this.createVerifyHash(inputs.document)
    const [header, _] = this.jws.split('..')

    if (header !== this.encodedJWTHeader) {
      throw new Error(
        'Invalid JWS header, expected ' +
          base64url.parse(this.encodedJWTHeader).toString()
      )
    }

    const toVerify = Buffer.concat([
      Buffer.from(this.encodedJWTHeader + '.', 'utf8'),
      digest,
    ])

    return verifySignatureWithIdentity(
      toVerify,
      this.signatureSuite.decodeSignature(this.jws),
      this.verificationMethod,
      signer
    )
  }

  /**
   * Will normalize the contents of the signed document, hash them, then normalize the
   * current "Proof Options" and hash them. Generates the inputs for the signature generation / verification functions.
   * Generally covers this process {@see https://w3c-ccg.github.io/data-integrity-spec/#create-verify-hash-algorithm}
   * @returns Buffer to be signed / verified.
   */

  private async createVerifyHash(document: JsonLdObject) {
    // Normalized Document
    const normalizedDoc = await this.signatureSuite.normalizeFn(document)

    const { jws, ...proofOptions } = this.toJSON()

    const normalizedProofOptions = await this.signatureSuite.normalizeFn(
      proofOptions
    )

    return Buffer.concat([
      this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
      this.signatureSuite.hashFn(Buffer.from(normalizedDoc)),
    ])
  }

  /**
   * Instantiates a {@link Ed25519Signature2018} from it's JSON form
   * @param json - Linked data signature in JSON-LD form
   */

  public static fromJSON(
    json: ILinkedDataSignatureAttrs
  ): Ed25519Signature2018<BaseProofOptions> {
    return plainToClass(Ed25519Signature2018, json)
  }

  /**
   * Serializes the {@link Ed25519Signature2018} as JSON-LD
   */

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
