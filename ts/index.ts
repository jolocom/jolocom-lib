import 'reflect-metadata'
import { Identity } from './identity'
import { IdentityWallet } from './wallet'
import { Credentials } from './credentials'
import { ILibConfig } from './types'
import { IDefaultClaimsMetadata } from './credentials/credential/types'

export class JolocomLib {
  public identity: Identity
  public wallet: IdentityWallet
  public credentials: Credentials

  // TODO Creation process should be changed.
  constructor(config: ILibConfig) {
    this.wallet = new IdentityWallet()
    this.identity = new Identity(config)
    this.credentials = new Credentials()
  }
}

export const claimsMetadata: IDefaultClaimsMetadata = {
  emailAddress: {
    fieldName: 'email',
    type: ['Credential'],
    context: [
      'https://w3id.org/identity/v1',
      'https://w3id.org/security/v1',
      'https://w3id.org/credentials/v1',
      'http://schema.org'
    ]
  },
  mobilePhoneNumber: {
    fieldName: 'telephone',
    type: ['Credential'],
    context: [
      'https://w3id.org/identity/v1',
      'https://w3id.org/security/v1',
      'https://w3id.org/credentials/v1',
      'http://schema.org'
    ]
  }
}

export enum keyTypes {
  jolocomIdentityKey = 'm/73\'/0\'/0\'/0',
  ethereumKey = 'm/44\'/60\'/0\'/0/0'
}
