import AuthenticationCredential from './AuthenticationCredential'
import * as AuthCredential from './AuthenticationCredential'
import LinkedDataSignature from './LinkedDataSignature'
import Did from './Did'

/* Describes Identity according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class DidDocument {
  public "@context": string = "https://w3id.org/did/v1";
  public id: Did;
  public authenticationCredential: AuthenticationCredential;
  public created: number;

  constructor(publicKey: string) {
    this.id = new Did(publicKey)
    this.authenticationCredential = AuthCredential.ecdsaAuthenticationCredentials(publicKey, this.id)
    this.created = Date.now()
  }
}
