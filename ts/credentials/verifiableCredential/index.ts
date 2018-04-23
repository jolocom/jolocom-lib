import 'reflect-metadata'
import { plainToClass, classToPlain, Type } from 'class-transformer'
import { keccak256 } from 'ethereumjs-util'
import { canonize } from 'jsonld'
import { IClaim } from '../credential/types';
import { Credential } from '../credential'
import { IPrivateKey } from '../../wallet/types'
import { generateRandomID, sign, sha256, verifySignature } from '../../utils/crypto'
import { IVerifiableCredential } from './types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature/suites/ecdsaKoblitzSignature2016'

export class VerifiableCredential {
  private '@context': string[]
  private id: string
  private issuer: string
  private type: string[]
  private claim: IClaim

  @Type(() => Date)
  private issued: Date

  @Type(() => Date)
  private expires?: Date

  @Type(() => EcdsaLinkedDataSignature)
  private signature = new EcdsaLinkedDataSignature()

  public setIssuer(issuer: string) {
    this.issuer = issuer
    this.id = this.generateClaimId()
  }

  public setIssued(issued: Date) {
    this.issued = issued
  }

  public fromCredential(credential: Credential): VerifiableCredential {
    const vc = new VerifiableCredential()
    vc['@context'] = credential.getContext()
    vc.type = credential.getType()
    vc.claim = credential.getClaim()
    return vc
  }

  public async generateSignature(privateKey: IPrivateKey) {
    this.signature.created = new Date()
    this.signature.creator = `${this.issuer}#${privateKey.id}`
    this.signature.nonce = generateRandomID(8)

    const docDigest = await this.digest()
    const sigDigest = await this.signature.digest()

    this.signature.signatureValue = sign(`${sigDigest}${docDigest}`, privateKey.privateKey)
  }

  // TODO If no pubKey passed, fetch from ipfs
  public async verifySignature(pubKey?: Buffer): Promise<boolean> {
    const docDigest = await this.digest()
    const sigDigest = await this.signature.digest()

    const tbv = sigDigest + docDigest
    const sig = this.signature.getSigValue()

    return verifySignature(tbv, pubKey, sig)
  }

  public fromJSON(json: IVerifiableCredential): VerifiableCredential {
    return plainToClass(VerifiableCredential, json)
  }

  public toJSON(): IVerifiableCredential {
    return classToPlain(this) as IVerifiableCredential
  }

  public async digest(): Promise<string> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized)).toString('hex')
  }

  private generateClaimId(): string {
    const hash = keccak256(`${this.issuer}${this.type.toString()}`).toString('hex')
    return `claimId:${hash.substring(20)}`
  }

  // TODO Generic context for normalization.
  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.signature
    return canonize(json)
  }
}
