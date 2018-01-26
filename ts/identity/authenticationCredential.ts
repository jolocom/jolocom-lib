import Did from './did'
import { AuthenticationCredentialAttrs } from './types'

/* Describes AuthorizationCredential according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class AuthenticationCredential implements AuthenticationCredentialAttrs {
  public id: Did
  public 'type': string[]
  public owner: Did
  public curve: string
  public publicKeyBase64: string

  constructor() {}

  static ecdsaAuthenticationCredentials(publicKey: string, did: Did): any {
    let credential = {
      id: this.generateGenericKeyId(did),
      'type': ["CryptographicKey", "EcDsaSAKey"],
      owner: did,
      curve: 'secp256k1',
      publicKeyBase64: publicKey
    } as AuthenticationCredential
    return credential
  }

  static generateGenericKeyId(did: Did): Did {
    return Did.fromJson(did.toJSON() + '#keys/generic/1')
  }
}
