import 'reflect-metadata'
import { Transform, plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { canonize } from 'jsonld'
import { generateRandomID, sha256 } from '../../utils/crypto'
import { ISignedCredentialAttrs } from './types'
import { ILinkedDataSignature, IDigestable } from '../../linkedDataSignature/types'
import { ContextEntry, BaseMetadata } from 'cred-types-jolocom-core'
import { IClaimSection } from '../credential/types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import { ISigner } from '../../registries/types'
import { SoftwareKeyProvider } from '../../crypto/softwareProvider'
import { ISignedCredCreationArgs, IKeyMetadata } from '../../identityWallet/identityWallet'
import { Credential } from '../credential/credential'

interface IExtendedCreationArgs<T extends BaseMetadata> extends ISignedCredCreationArgs<T> {
  publicKeyMetadata: IKeyMetadata
  issuerDid: string
}

@Exclude()
export class SignedCredential implements IDigestable {
  @Expose()
  private '@context': ContextEntry[]

  @Expose()
  @Transform((value: string) => value || generateRandomID(8), { toClassOnly: true })
  private id: string = `claimId:${this.generateClaimId()}`

  @Expose()
  private name: string

  @Expose()
  private issuer: string

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimSection

  @Expose()
  @Type(() => Date)
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => (value ? new Date(value) : new Date()), { toClassOnly: true })
  private issued: Date

  @Expose()
  @Type(() => Date)
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => new Date(value), { toClassOnly: true })
  private expires?: Date

  @Expose()
  @Type(() => EcdsaLinkedDataSignature)
  @Transform((value) => value || new EcdsaLinkedDataSignature(), { toClassOnly: true })
  private proof = new EcdsaLinkedDataSignature()

  public setIssuer(issuer: string) {
    this.issuer = issuer
  }

  public setIssued(issued: Date) {
    this.issued = issued
  }
  public setExpiry(expiry: Date) {
    this.expires = expiry
  }

  public getId(): string {
    return this.id
  }

  public getIssued(): Date {
    return this.issued
  }

  public getType(): string[] {
    return this.type
  }

  public getIssuer(): string {
    return this.issuer
  }

  public getSignatureValue() {
    return this.proof.getSignatureValue()
  }

  public setSignatureValue(signature: Buffer) {
    this.proof.setSignatureValue(signature)
  }

  public getSigner(): ISigner {
    return {
      did: this.issuer,
      keyId: this.proof.getCreator()
    }
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

    if (customType) {
      return customType.replace(/([A-Z])/g, ' $1').trim()
    }

    return 'Credential'
  }

  public static async create<T extends BaseMetadata>(params: IExtendedCreationArgs<T>): Promise<SignedCredential> {
    const credential = Credential.create(params)
    const json = credential.toJSON() as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)

    signedCredential.prepareSignature(params.publicKeyMetadata)
    signedCredential.setIssuer(params.issuerDid)

    return signedCredential
  }

  private async prepareSignature(keyMetadata: IKeyMetadata) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this.setExpiry(inOneYear)

    this.proof.setCreator(keyMetadata.keyId)
    this.proof.setNonce(SoftwareKeyProvider.getRandom(8).toString('hex'))
  }

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
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
