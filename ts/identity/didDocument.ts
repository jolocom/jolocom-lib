import AuthenticationCredential from './AuthenticationCredential'
import * as AuthCredential from './AuthenticationCredential'
import LinkedDataSignature from './LinkedDataSignature'
import DidDocumentAttrs from './didDocumentAttrs'
import Did from './Did'

/* Describes Identity according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class DidDocument implements DidDocumentAttrs {
  '@context': string = "https://w3id.org/did/v1"
  id: Did
  authenticationCredential: AuthenticationCredential
  created: Date

  constructor(publicKey: string) {
    this.id = new Did(publicKey)
    this.authenticationCredential = AuthCredential.ecdsaAuthenticationCredentials(publicKey, this.id)
    this.created = new Date(Date.now())
  }

  static fromJson(json: DidDocumentAttrs): Did {
    let did = Object.create(DidDocument.prototype)
    return Object.assign(did, json, {
      created: new Date(json.created)
    })
  }
}
