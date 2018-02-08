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
		this.id =  (this as any)._generateVerifiableCredentialID()
		this.type = credentialType
		this.issuer = issuerID
		this.issued = (this as any)._dateIssued()
		this.claim = claim
  }

	private _generateVerifiableCredentialID() : string {
		const UintArray = new Uint32Array(sjcl.random.randomWords(2))
    const buf = Buffer.from(UintArray.buffer)
    return buf.toString('hex')
	}

	private _dateIssued() : string {
		return new Date(Date.now()).toString()
	}
}
