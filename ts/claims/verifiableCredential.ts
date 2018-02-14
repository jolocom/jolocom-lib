import { IVerifiableCredentialAttrs } from './types'
import * as sjcl from 'sjcl'
import * as bitcoin from 'bitcoinjs-lib'
const Web3 = require('web3')
import { IClaim } from './types'
import { IVerifiedCredential } from './types'
import { sign, verify } from '../utils/signature'
import * as moment from 'moment'

export default class VerifiableCredential implements IVerifiableCredentialAttrs {
  public '@context': string = "https://w3id.org/credentials/v1"
  public id: string
  public 'type': string[]
  public issuer: string
  public issued: string
  public claim: IClaim
  public expires: string

  constructor({credentialType, issuer, claim, expires } :
    {credentialType: string[], issuer: string, claim: IClaim, expires?: string}) {
    this.id =  (this as any).generateVerifiableCredentialID()
    this.type = credentialType
    this.issuer = issuer
    this.issued = (this as any).dateIssued()
    this.claim = claim
    this.expires = expires
  }

  public static createVerified({issuer, credentialType, claim, privateKeyWIF, expires} :
    {issuer: string, credentialType: string[], claim: IClaim, privateKeyWIF: string, expires?: string}) :
  IVerifiedCredential {
    if (expires) {
      const now = moment.utc()
      const expiry = moment.utc(expires, moment.ISO_8601)
      const validFormat = expiry.isValid()
      const validExpiryDate = moment.duration(expiry.diff(now)).asHours()

      if (validExpiryDate > 1 && validFormat) {
        const unsignedCredential = new VerifiableCredential({credentialType, issuer, claim, expires})
        return unsignedCredential.signCredential({privateKeyWIF})
      } else {
        throw new Error(`The provided expiry date of ${expires} is not valid or the format you pass in is not compliant to ISO_8601.`)
      }
    }

    const unsignedCredential = new VerifiableCredential({
      credentialType,
      issuer,
      claim,
      expires
    })
    return unsignedCredential.signCredential({privateKeyWIF})
  }

  public verifySignedCredential({signature, publicKeyOfIssuer} :
    {signature: string, publicKeyOfIssuer: string}) : boolean {
    const buffer = Buffer.from(signature, 'hex')
    return verify(this, publicKeyOfIssuer, buffer)
  }

  private signCredential({privateKeyWIF} : {privateKeyWIF: string}) : IVerifiedCredential {
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
    return moment.utc().format()
  }
}
