import AuthenticationCredential from './authenticationCredential'
import LinkedDataSignature from './linkedDataSignature'
import { DidDocumentAttrs } from './types'
import Did from './did'

/* Describes Identity according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class DidDocument {
  public '@context': string = "https://w3id.org/did/v1"
  public id: Did
  public authenticationCredential: AuthenticationCredential
  public created: Date

  constructor() {
  }

  static create(publicKey: Buffer) {
    let ddo = new DidDocument()
    ddo.id = Did.create(publicKey)
    ddo.authenticationCredential = AuthenticationCredential.ecdsaCredentials(publicKey.toString(), ddo.id)
    ddo.created = new Date(Date.now())
    return ddo
  }

  static reviver(key: string, value: any): any {
    return key === "" ? DidDocument.fromJSON(value) : value;
  }

  static fromJSON(json: DidDocumentAttrs): DidDocument {
    const did = Object.create(DidDocument.prototype)
    const parsedAuthCredentials = JSON.parse(JSON.stringify(json.authenticationCredential), AuthenticationCredential.reviver)
    return Object.assign(did, json, {
			id: Did.fromJSON(json.id),
			authenticationCredential: parsedAuthCredentials,
      created: new Date(json.created)
    })
  }
}
