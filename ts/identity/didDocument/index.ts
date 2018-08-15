import { plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { publicKeyToDID, privateKeyToDID, privateKeyToPublicKey, sha256, verifySignature, generateRandomID, sign } from '../../utils/crypto'
import { IDidDocumentAttrs } from './types'
import { AuthenticationSection } from './sections/authenticationSection'
import { ServiceEndpointsSection } from './sections/serviceEndpointsSection'
import { PublicKeySection } from './sections/publicKeySection'
import { canonize } from 'jsonld'
import { JolocomRegistry } from '../../registries/jolocomRegistry';
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature/suites/ecdsaKoblitzSignature2016';

@Exclude()
export class DidDocument {
  @Type(() => AuthenticationSection)
  @Expose()
  private authentication: AuthenticationSection[] = []

  @Type(() => PublicKeySection)
  @Expose()
  private publicKey: PublicKeySection[] = []

  @Type(() => ServiceEndpointsSection)
  @Expose()
  private service: ServiceEndpointsSection[] = []

  @Type(() => Date)
  @Expose()
  private created: Date

  @Type(() => EcdsaLinkedDataSignature)
  @Expose()
  private proof = new EcdsaLinkedDataSignature()

  @Expose()
  private '@context': string = 'https://w3id.org/did/v1'

  @Expose()
  private id: string

  public async fromPrivateKey(privateKey: Buffer): Promise<DidDocument> {
    const did = privateKeyToDID(privateKey)
    const publicKey = privateKeyToPublicKey(privateKey)

    const keyId = `${did}#keys-1`
    const publicKeySection = new PublicKeySection().fromEcdsa(publicKey, keyId)
    const authenticationSection = new AuthenticationSection().fromEcdsa(publicKeySection)

    const didDocument = new DidDocument()
    didDocument.created = new Date()
    didDocument.id = did
    didDocument.publicKey.push(publicKeySection)
    didDocument.authentication.push(authenticationSection)

    await didDocument.generateSignature({key: privateKey, id: keyId})
    return didDocument
  }

  public async generateSignature({key, id}: {key: Buffer, id: string}) {
    const docDigest = await this.digest()
    this.proof.created = new Date()
    this.proof.creator = id
    this.proof.nonce = generateRandomID(8)
    this.proof.signatureValue = sign(`${docDigest}`, key)
  }

  public async validateSignature(registry?: JolocomRegistry): Promise<boolean> {
    if (!registry) {
      registry = JolocomRegistry.create()
    }

    const creatorDid = this.proof.creator.substring(0, this.proof.creator.indexOf('#'))
    const creatorProfile = await registry.resolve(creatorDid)
    const relevantPublicKey = creatorProfile.getPublicKeySection()
      .find((keySection) => keySection.getIdentifier() === this.proof.creator)

    if (!relevantPublicKey) {
      return false
    }

    const pubKey = Buffer.from(relevantPublicKey.getPublicKeyHex(), 'hex')
    return this.validateSignatureWithPublicKey(pubKey)
  }

  public async validateSignatureWithPublicKey(pubKey: Buffer): Promise<boolean> {
    if (!pubKey) {
      throw new Error('Please provide the issuer\'s public key')
    }

    const docDigest = await this.digest()
    const sig = this.proof.getSigValue()

    return verifySignature(docDigest, pubKey, sig)
  }

  public async digest(): Promise<string> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized)).toString('hex')
  }

  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof
    return canonize(json)
}

  public getDID(): string {
    return this.id
  }

  public getServiceEndpoints(): ServiceEndpointsSection[] {
    return this.service
  }

  public getPublicKeySection() {
    return this.publicKey
  }

  public toJSON(): IDidDocumentAttrs {
    return classToPlain(this) as IDidDocumentAttrs
  }

  public static fromJSON(json: IDidDocumentAttrs): DidDocument {
    return plainToClass(DidDocument, json)
  }
}