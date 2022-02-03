import assert from 'assert'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { SignedCredential } from './signedCredential'
import { Credential } from './credential'
import {
  LinkedDataProof,
  SupportedSuites,
  BaseProofOptions,
} from '../../linkedDataSignature'
import { ProofOptions } from '../../linkedDataSignature/types'
import { SuiteImplementation } from '../../linkedDataSignature/mapping'
import {
  ChainedProof2021,
  PreviousProofOptions,
} from '../../linkedDataSignature/suites/chainedProof2021'
import { SignedCredentialJSON } from './types'

type GenerateProofArgs<T extends SupportedSuites> = {
  proofOptions: ProofOptions
  proofSpecificOptions: ExtendedSuites[T]['customArgs']
}

type ExtendedSuites = typeof SuiteImplementation & {
  [SupportedSuites.ChainedProof2021]: {
    impl: typeof ChainedProof2021
    customArgs: {
      chainSignatureSuite: SupportedSuites
      previousProof: PreviousProofOptions
    }
  }
}

const AllsuiteImpls = {
  [SupportedSuites.ChainedProof2021]: {
    impl: ChainedProof2021,
    customArgs: {} as {
      chainSignatureSuite: SupportedSuites
      previousProof: PreviousProofOptions
    },
  },
  ...SuiteImplementation,
} as ExtendedSuites

/**
 * An instance of this class can be instantiated based on a Credential / Signed Credential instance (e.g. received as JSON, constructed using this library)
 * The CredentialSigner class can be used to generate and append new (potentially complex) proof types to a Credential / Verifiable Credential.
 */

export class CredentialSigner {
  private _credential: Credential = null

  private _proofs: Array<LinkedDataProof<BaseProofOptions>> = []
  private issuanceMetadata: Partial<{
    expiry: Date
    issuance: Date
    issuer: string
  }> = {}

  get proofs() {
    return this._proofs
  }

  private addProof<P extends BaseProofOptions>(proof: LinkedDataProof<P>) {
    this.proofs.push(proof)
  }

  private addProofs(proofS: LinkedDataProof<BaseProofOptions>[]) {
    proofS.forEach((p) => {
      p && this.addProof(p)
    })
    return this
  }

  get credential(): Credential {
    return this._credential
  }

  set credential(credential: Credential) {
    this._credential = credential
  }

  setIssuer(issuer: string) {
    this.issuanceMetadata.issuer = issuer
    return this
  }

  setDates(issuance: Date, expiry: Date) {
    this.issuanceMetadata = {
      ...this.issuanceMetadata,
      expiry,
      issuance,
    }
    return this
  }

  /**
   * Helper method to automatically populate the issuance and expiry dates.
   */
  generateAndSetDates() {
    this.issuanceMetadata = {
      ...this.issuanceMetadata,
      issuance: new Date(),
      expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    }
  }


  /**
   * Will attempt to generate a new Linked Data proof of the specified proofType (including the associated signature)
   * Ends up delegating to the {@link LinkedDataProof.derive} method. Arguments mirror those of LinkedDataProof.derive
   * The newly generated proof is added to the document
   * @returns  - The newly generated LD proof
   */
  async generateProof<T extends SupportedSuites>(
    proofType: T,
    opts: GenerateProofArgs<T>,
    issuer: IdentityWallet,
    pass: string
  ): Promise<LinkedDataProof<BaseProofOptions>> {
    this.ensureReadyToIssue()

    const { proof, ...document } = this.toSignedCredential().toJSON()

    const suiteImpl = AllsuiteImpls[proofType]

    if (!suiteImpl) {
      throw new Error(`Signature suite ${proofType} not suported`)
    }

    const ldProofImpl = suiteImpl.impl.create(opts.proofOptions)

    const ldProof = (await ldProofImpl.derive(
      {
        document,
        previousProofs: this.proofs,
      },
      opts.proofSpecificOptions,
      issuer,
      pass
    )) as LinkedDataProof<BaseProofOptions>

    this.addProof(ldProof)

    return ldProof
  }

  /**
   * Ensures the required metadata fields on the credential are set.
   * @returns void
   */
  private ensureReadyToIssue() {
    assert(this.credential, 'no credential set')
    assert(this.issuanceMetadata.issuer, 'issuer not set')
    assert(this.issuanceMetadata.issuance, 'issuance date not set')
    return
  }

  /**
   * Will assemble the credential, proofs, and issuance metadata managed by this class
   * into an instance of a signed credential.
   * @returns {@link SignedCredential}
   */
  public toSignedCredential(): SignedCredential {
    this.ensureReadyToIssue()
    const signedCred = this.credential.toVerifiableCredential()
    signedCred.issuer = this.issuanceMetadata.issuer
    signedCred.expires = this.issuanceMetadata.expiry
    signedCred.issued = this.issuanceMetadata.issuance
    signedCred.proof = this.proofs.filter((p) => !!p)
    return signedCred
  }

  /**
   * Static methods to instantiate a signer based on an instance of a credential / signed credential class
   * or the corresponding JSON representation.
   */

  static fromCredential(credential: Credential) {
    return new CredentialSigner().setCredential(credential)
  }

  static fromSignedCredential(
    vcOrJSON: SignedCredential | SignedCredentialJSON
  ) {
    const signedCredential =
      vcOrJSON instanceof SignedCredential
        ? vcOrJSON
        : SignedCredential.fromJSON(vcOrJSON)

    return new CredentialSigner()
      .setCredential(signedCredential.credential)
      .setDates(signedCredential.issued, signedCredential.expires)
      .setIssuer(signedCredential.issuer)
      .addProofs(signedCredential.proof)
  }

  private setCredential(credential: Credential) {
    if (!this.credential) {
      assert(credential.id, new Error('credential identifier must be present'))
      assert(
        credential.context[0] === 'https://www.w3.org/2018/credentials/v1',
        new Error(
          'context must be one or more URIs, first URI must be https://www.w3.org/2018/credentials/v1'
        )
      )
      assert(
        credential.type.length > 1 &&
          credential.type[0] === 'VerifiableCredential',
        new Error(
          'Type must contain at least two entries, first must be VerifiableCredential'
        )
      )
      assert(
        credential.credentialSubject.id,
        new Error(
          'credentialSubject section must be present. Multiple subjects are not supported.'
        )
      )

      this.credential = credential
    }
    return this
  }
}
