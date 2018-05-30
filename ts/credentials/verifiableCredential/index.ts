import 'reflect-metadata'
import { plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { keccak256 } from 'ethereumjs-util'
import { canonize } from 'jsonld'
import { IClaimAttrs } from '../credential/types'
import { Credential } from '../credential'
import { IPrivateKey } from '../../wallet/types'
import { generateRandomID, sign, sha256, verifySignature } from '../../utils/crypto'
import { IVerifiableCredentialAttrs } from './types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature/suites/ecdsaKoblitzSignature2016'
import { defaultContext } from '../../utils/contexts'
import { proofTypes, ILinkedDataSignature } from '../../linkedDataSignature/types'

@Exclude()
export class VerifiableCredential {
  @Expose()
  private '@context': string[] | object[]

  @Expose()
  private id: string

  @Expose()
  private name: string

  @Expose()
  private issuer: string

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimAttrs

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

  public fromCredential(credential: Credential): VerifiableCredential {
    const vc = new VerifiableCredential()
    vc['@context'] = credential.getContext()
    vc.type = credential.getType()
    vc.claim = credential.getClaim()
    vc.name = credential.getName()
    return vc
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

  // TODO If no pubKey passed, fetch from ipfs
  public async verifySignature(pubKey?: Buffer): Promise<boolean> {
    const docDigest = await this.digest()
    const sigDigest = await this.proof.digest()

    const tbv = sigDigest + docDigest
    const sig = this.proof.getSigValue()

    return verifySignature(tbv, pubKey, sig)
  }

  public fromJSON(json: IVerifiableCredentialAttrs): VerifiableCredential {
    return plainToClass(VerifiableCredential, json)
  }

  public toJSON(): IVerifiableCredentialAttrs {
    return classToPlain(this) as IVerifiableCredentialAttrs
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
