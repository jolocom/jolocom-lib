import AuthenticationCredential from './authenticationCredential'
import Did from './did'
import LinkedDataSignature from './linkedDataSignature'
import { IDidDocumentAttrs } from './types'

export default class DidDocument {
  public '@context': string = 'https://w3id.org/did/v1'
  public id: Did
  public authenticationCredential: AuthenticationCredential
  public created: Date
  public credentialsEndpoint: string = ''

  constructor(publicKey: Buffer) {
    const pubKeyHex = publicKey.toString('hex')
    this.id = new Did(pubKeyHex)
    this.authenticationCredential = AuthenticationCredential
      .ecdsaCredentials(publicKey.toString('base64'), this.id)
    this.created = new Date()
  }

  public static reviver(key: string, value: any): any {
    return key === '' ? DidDocument.fromJSON(value) : value
  }

  public static fromJSON(json: IDidDocumentAttrs): DidDocument {
    const did = Object.create(DidDocument.prototype)
    const parsedAuthCredentials = JSON.parse(
      JSON.stringify(json.authenticationCredential), AuthenticationCredential.reviver,
    ) as AuthenticationCredential

    return Object.assign(did, json, {
      id: Did.fromJSON(json.id),
      authenticationCredential: parsedAuthCredentials,
      created: new Date(json.created),
      credentialsEndpoint: json.credentialsEndpoint
    })
  }
}
