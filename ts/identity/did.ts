import { IDidAttrs } from './types'
import VerifiableCredential from './verifiableCredential'
import * as bitcoin from 'bitcoinjs-lib'
const Web3 = require('web3')
import { sign, verify } from '../utils/utils'


export default class Did implements IDidAttrs{
  public identifier: string

  constructor(publicKey: string) {
    const prefix = 'did:jolo:'
    const suffix = Web3.utils.soliditySha3(publicKey)
    this.identifier = prefix + suffix
  }

  public static fromJSON(json: string): Did {
    const did = Object.create(Did.prototype)
    return Object.assign(did, {
      identifier: json,
    })
  }

  public toJSON(): string {
    return this.identifier
  }

  public createVerifiableCredential(credentialType, claim, privateKeyWIF) {
    const unsignedCredential = new VerifiableCredential(credentialType, this.identifier, claim)
    return this._signCredential(unsignedCredential, privateKeyWIF)
  }

  private _signCredential(unsignedCredential, privateKeyWIF) {
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF)
    const privateKey = keyPair.d.toBuffer(32)
    const signature = sign(unsignedCredential, privateKey, keyPair.compressed)
    const signatureHex = signature.toString('hex')
    const signedCredential = {credential: unsignedCredential, signature: signatureHex}
    return signedCredential
  }

  public verifySignedCredential(credential, publicKeyOfIssuer) {
    const buffer = Buffer.from(credential.signature, 'hex')
    return verify(credential.credential, publicKeyOfIssuer, buffer)
  }
}
