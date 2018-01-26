import AuthenticationCredential from './authenticationCredential'
import * as AuthCredential from './authenticationCredential'
import LinkedDataSignature from './linkedDataSignature'
import DidDocumentAttrs from './didDocumentAttrs'
import Did from './Did'

/* Describes Identity according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class DidDocument implements DidDocumentAttrs {
  public '@context': string = "https://w3id.org/did/v1"
  public id: Did
  public authenticationCredential: AuthenticationCredential
  public created: Date

  constructor(publicKey: Buffer) {
    this.id = new Did(publicKey)
    this.authenticationCredential = AuthCredential.ecdsaAuthenticationCredentials(publicKey.toString(), this.id)
    this.created = new Date(Date.now())
  }

  static fromJson(json: DidDocumentAttrs): Did {
    let did = Object.create(DidDocument.prototype)
    return Object.assign(did, json, {
      created: new Date(json.created)
    })
  }
}
