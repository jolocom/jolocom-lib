import 'reflect-metadata'
import { plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { canonize } from 'jsonld'
import { Credential } from '../credential/credential'
import { generateRandomID, sign, sha256, verifySignature, privateKeyToDID } from '../../utils/crypto'
import { ISignedCredentialAttrs } from './types'
import { ILinkedDataSignature } from '../../linkedDataSignature/types'
import { ContextEntry, BaseMetadata } from 'cred-types-jolocom-core'
import { IClaimSection } from '../credential/types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import { IPrivateKeyWithId } from '../../identityWallet/types';

@Exclude()
export class SignedCredential {
  @Expose()
  private '@context': ContextEntry[]

  @Expose()
  private id: string

  @Expose()
  private name: string

  @Expose()
  private issuer: string

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimSection

  @Type(() => Date)
  @Expose()
  private issued: Date

  @Type(() => Date)
  @Expose()
  private expires?: Date

  @Type(() => EcdsaLinkedDataSignature)
  @Expose()
  private proof = new EcdsaLinkedDataSignature()

  public setIssuer(issuer: string) {
    this.issuer = issuer
  }

  public setId() {
    this.id = this.generateClaimId()
  }

  public setIssued(issued: Date) {
    this.issued = issued
  }

  public getId(): string {
    return this.id
  }

  public getType(): string[] {
    return this.type
  }

  public getIssuer(): string {
    return this.issuer
  }

  public getExpiryDate(): Date {
    return this.expires
  }

  public getProofSection(): ILinkedDataSignature {
    return this.proof
  }

  public getSubject(): string {
    return this.claim.id
  }

  public getCredentialSection(): IClaimSection {
    return this.claim
  }

  public getDisplayName(): string {
    if (this.name) {
      return this.name
    }

    const customType = this.type.find(t => t !== 'Credential')

    if (!customType) {
      return 'Credential'
    }

    return customType.replace(/([A-Z])/g, ' $1').trim()
  }

  public static async create<T extends BaseMetadata>({
    metadata,
    claim,
    privateIdentityKey,
    subject
  }: {
    metadata: T
    claim: typeof metadata['claimInterface']
    privateIdentityKey: IPrivateKeyWithId
    subject: string
  }): Promise<SignedCredential> {
    const credential = Credential.create<T>({ metadata, claim, subject })
    const signedCredential = SignedCredential.fromCredential(credential)
    await signedCredential.generateSignature(privateIdentityKey)

    return signedCredential
  }

  public static fromCredential(credential: Credential): SignedCredential {
    const signedCredential = new SignedCredential()
    signedCredential['@context'] = credential.getContext()
    signedCredential.type = credential.getType()
    signedCredential.claim = credential.getClaim()
    signedCredential.name = credential.getName()
    signedCredential.setId()
    signedCredential.setIssued(new Date())

    return signedCredential
  }

  public async generateSignature({ key, id }: { key: Buffer; id: string }) {
    this.proof.created = new Date()
    this.proof.creator = id
    this.proof.nonce = generateRandomID(8)
    this.setIssuer(privateKeyToDID(key))

    const docDigest = await this.digest()
    const sigDigest = await this.proof.digest()

    this.proof.signatureValue = sign(`${sigDigest}${docDigest}`, key)
  }

  public async validateSignatureWithPublicKey(pubKey: Buffer): Promise<boolean> {
    if (!pubKey) {
      throw new Error("Please provide the issuer's public key")
    }

    const docDigest = await this.digest()
    const sigDigest = await this.proof.digest()

    const tbv = sigDigest + docDigest
    const sig = this.proof.getSigValue()

    return verifySignature(tbv, pubKey, sig)
  }

  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
  }

  public async digest(): Promise<string> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized)).toString('hex')
  }

  private generateClaimId(): string {
    const randomString = generateRandomID(8)
    return `claimId:${randomString}`
  }

  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof

    return canonize(json)
  }
}
