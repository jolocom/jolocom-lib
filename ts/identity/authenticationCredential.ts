import Did from './did'
import { IAuthenticationCredentialAttrs } from './types'

export default class AuthenticationCredential {
  public id: Did
  public 'type': string[]
  public owner: Did
  public curve: string
  public publicKeyBase64: string

  constructor() {}

  public static ecdsaCredentials(publicKey: string, did: Did): any {
    const authCredential = new AuthenticationCredential()
    authCredential.id = this.generateGenericKeyId(did)
    authCredential.type = ['CryptographicKey', 'EcDsaSAKey']
    authCredential.owner = did
    authCredential.curve = 'secp256k1'
    authCredential.publicKeyBase64 = publicKey
    return authCredential
  }

  public static generateGenericKeyId(did: Did): Did {
    const newDid = Object.create(Did.prototype)
    newDid.identifier = `${did.identifier}#keys/generic/1`
    return newDid
  }

  public static reviver(key: string, value: any): any {
    return key === '' ? AuthenticationCredential.fromJSON(value) : value
  }

  public static fromJSON(json: IAuthenticationCredentialAttrs): AuthenticationCredential {
    const authCredential = Object.create(AuthenticationCredential.prototype)
    return Object.assign(authCredential, json, {
      id: Did.fromJSON(json.id),
      owner: Did.fromJSON(json.owner),
    })
  }

  public toJSON(): IAuthenticationCredentialAttrs {
    return Object.assign({} as IAuthenticationCredentialAttrs, this, {
      id: this.id.toJSON(),
      owner: this.owner.toJSON()
    })
  }
}
