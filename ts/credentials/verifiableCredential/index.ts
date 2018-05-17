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
import { defaultContext } from '../../utils/contexts';

export class VerifiableCredential {
  private '@context': string[] | object[]
  private id: string
  private issuer: string
  private type: string[]
  private claim: IClaim

  @Type(() => Date)
  private issued: Date

  @Type(() => Date)
  private expires?: Date

  @Type(() => EcdsaLinkedDataSignature)
  private proof = new EcdsaLinkedDataSignature()

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
    this.proof.created = new Date()
    this.proof.creator = `${this.issuer}#${privateKey.id}`
    this.proof.nonce = generateRandomID(8)

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

    json['@context'] = [defaultContext]
    delete json.proof

    return canonize(json)
  }
}
