import { IVerifiableCredentialAttrs } from './types'
import * as sjcl from 'sjcl'

export default class VerifiableCredential implements IVerifiableCredentialAttrs {
  public '@context': string = "https://w3id.org/credentials/v1"
	public id: string
	public 'type': string[]
	public issuer: string
	public issued: string
  public claim: { id: string; [x:string]:any }
	public proof: string

	constructor(credentialType: string[], issuerID: string, claim: { id: string; [x:string]:any }) {
		this.id =  this._generateVerifiableCredentialID()
		this.type = credentialType
		this.issuer = issuerID
		this.issued = this._dateIssued()
		this.claim = claim
		this.proof = ''
	}
	private static _generateVerifiableCredentialID() {
		const intArray = new Int32Array(sjcl.random.randomWords(2))
		const buf = Buffer.from(intArray.buffer)
		return buf.toString('hex')
	}
	private static _dateIssued() : string {
		return new Date(Date.now()).toString()
	}
}
