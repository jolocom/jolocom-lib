import { IVerifiableCredentialAttrs } from './types'
import * as sjcl from 'sjcl'

export default class VerifiableCredential implements IVerifiableCredentialAttrs {
  public '@context': string = "https://w3id.org/credentials/v1"
  public id: string
  public 'type': string[]
  public issuer: string
  public issued: string
  public claim: { id: string; [x:string]:any }

  constructor(credentialType: string[], issuerID: string, claim: { id: string; [x:string]:any }) {
    this.id =  (this as any).generateVerifiableCredentialID()
    this.type = credentialType
    this.issuer = issuerID
    this.issued = (this as any).dateIssued()
    this.claim = claim
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
