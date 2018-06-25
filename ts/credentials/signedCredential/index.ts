import 'reflect-metadata'
import { plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { canonize } from 'jsonld'
import { IClaimAttrs } from '../credential/types'
import { Credential } from '../credential'
import { IPrivateKey } from '../../wallet/types'
import { generateRandomID, sign, sha256, verifySignature } from '../../utils/crypto'
import { ISignedCredentialAttrs } from './types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature/suites/ecdsaKoblitzSignature2016'
import { defaultContext } from '../../utils/contexts'
import { proofTypes, ILinkedDataSignature } from '../../linkedDataSignature/types'
import { JolocomRegistry } from '../../registries/jolocomRegistry'

@Exclude()
export class SignedCredential {
  @Expose() private '@context': string[] | object[]

  @Expose() private id: string

  @Expose() private name: string

  @Expose() private issuer: string

  @Expose() private type: string[]

  @Expose() private claim: IClaimAttrs

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

  public getCredentialSection(): IClaimAttrs {
    return this.claim
  }

  public getDisplayName(): string {
    if (this.name) {
      return this.name
    }

    const customType = this.type.find((t) => t !== 'Credential')

    if (!customType) {
      return 'Credential'
    }

    return customType.replace(/([A-Z])/g, ' $1').trim()
  }

  // TODO remove / modify in favor of identityWallet.sign.credential
  public fromCredential(credential: Credential): SignedCredential {
    const signedCred = new SignedCredential()
    signedCred['@context'] = credential.getContext()
    signedCred.type = credential.getType()
    signedCred.claim = credential.getClaim()
    signedCred.name = credential.getName()
    return signedCred
  }

  public async generateSignature(privateKey: IPrivateKey) {
    this.proof.created = new Date()
    this.proof.creator = `${this.issuer}#${privateKey.id}`
    this.proof.nonce = generateRandomID(8)
    this.proof.proofSectionType = proofTypes.proofSet

    const docDigest = await this.digest()
    const sigDigest = await this.proof.digest()

    this.proof.signatureValue = sign(`${sigDigest}${docDigest}`, privateKey.privateKey)
  }

  public async validateSignatureWithPublicKey(pubKey: Buffer): Promise<boolean> {
    if (!pubKey) {
      throw new Error('Please provide the issuer\'s public key')
    }

    const docDigest = await this.digest()
    const sigDigest = await this.proof.digest()

    const tbv = sigDigest + docDigest
    const sig = this.proof.getSigValue()

    return verifySignature(tbv, pubKey, sig)
  }

  public async validateSignature(registry?: JolocomRegistry): Promise<boolean> {
    if (!registry) {
      throw new Error('Can not instantiate default registry yet, WIP')
    }

    const issuerProfile = await registry.resolve(this.issuer)
    const relevantPublicKey = issuerProfile.publicKey.find((keySection) => keySection.id === this.proof.creator)

    if (!relevantPublicKey) {
      return false
    }

    const pubKey = Buffer.from(relevantPublicKey.publicKeyHex, 'hex')
    return this.validateSignatureWithPublicKey(pubKey)
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

    json['@context'] = [defaultContext]
    delete json.proof

    return canonize(json)
  }
}
