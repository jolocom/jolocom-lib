import Did from './did'
import { AuthenticationCredentialAttrs } from './types'

/* Describes AuthorizationCredential according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class AuthenticationCredential {
  public id: Did
  public 'type': string[]
  public owner: Did
  public curve: string
  public publicKeyBase64: string

  constructor() {
  }

  static ecdsaCredentials(publicKey: string, did: Did): any {
    return {
      id: this.generateGenericKeyId(did),
      'type': ["CryptographicKey", "EcDsaSAKey"],
      owner: did,
      curve: 'secp256k1',
      publicKeyBase64: publicKey
    } as AuthenticationCredential
  }

  static generateGenericKeyId(did: Did): Did {
    const newDid = new Did()
    newDid.identifier = `${did.identifier}#keys/generic/1`
    return newDid
  }

  static fromJSON(json: AuthenticationCredentialAttrs): AuthenticationCredential {
    let authCredential = Object.create(AuthenticationCredential.prototype)
    console.log(json)
    return Object.assign(authCredential, json, {
      id: Did.fromJSON(json.id),
      owner: Did.fromJSON(json.owner)
    })
  }
}
