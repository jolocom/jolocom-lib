import { IVerifiableCredentialAttrs } from './types'
import * as sjcl from 'sjcl'
import * as bitcoin from 'bitcoinjs-lib'
const Web3 = require('web3')
import { IClaim } from './types'
import { IVerifiedCredential } from './types'
import { sign, verify } from '../utils/signature'

export default class VerifiableCredential implements IVerifiableCredentialAttrs {
  public '@context': string = "https://w3id.org/credentials/v1"
  public id: string
  public 'type': string[]
  public issuer: string
  public issued: string
  public claim: IClaim

  constructor(credentialType: string[], issuerID: string, claim: IClaim) {
    this.id =  (this as any).generateVerifiableCredentialID()
    this.type = credentialType
    this.issuer = issuerID
    this.issued = (this as any).dateIssued()
    this.claim = claim
  }

  public static createVerified(issuer: string, credentialType: string[], claim: IClaim, privateKeyWIF: string) :
  IVerifiedCredential {
    const unsignedCredential = new VerifiableCredential(credentialType, issuer, claim)
    return unsignedCredential.signCredential(privateKeyWIF)
  }

  public verifySignedCredential(signature: string, publicKeyOfIssuer: string) : boolean {
    const buffer = Buffer.from(signature, 'hex')
    return verify(this, publicKeyOfIssuer, buffer)
  }

  private signCredential(privateKeyWIF: string) : IVerifiedCredential {
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF)
    const privateKey = keyPair.d.toBuffer(32)
    const signature = sign(this, privateKey, keyPair.compressed)
    const signatureHex = signature.toString('hex')
    const verifiedCredential = {credential: this, signature: signatureHex} as IVerifiedCredential
    return verifiedCredential
  }

  private generateVerifiableCredentialID() : string {
    const result = Buffer.allocUnsafe(8)
    sjcl.random.randomWords(2).forEach((el, index) => {
      result.writeInt32LE(el, index * 4)
    })

    return result.toString('hex')
  }

  private dateIssued() : string {
    return new Date(Date.now()).toString()
  }
}
