import 'reflect-metadata'
import { Identity } from './identity'
import { IdentityWallet } from './wallet'
import { Credentials } from './credentials'
import { ILibConfig } from './types'
import { IDefaultClaimsMetadata } from './credentials/credential/types'
import { defaultConfig } from './defaultConfig'
import { SSO } from './sso'

export class JolocomLib {
  public identity: Identity
  public wallet: IdentityWallet
  public credentials: Credentials
  public sso: SSO

  // TODO Creation process should be changed.
  constructor(config: ILibConfig = defaultConfig) {
    this.wallet = new IdentityWallet()
    this.identity = new Identity(config)
    this.credentials = new Credentials()
    this.sso = new SSO()
  }
}

export const claimsMetadata: IDefaultClaimsMetadata = {
  emailAddress: {
    fieldName: 'email',
    type: ['Credential', 'ProofOfEmailCredential'],
    name: 'Email address',
    context: [
      'https://w3id.org/identity/v1',
      'https://identity.jolocom.com/terms',
      'https://w3id.org/security/v1',
      'https://w3id.org/credentials/v1',
      'http://schema.org'
    ]
  },
  mobilePhoneNumber: {
    fieldName: 'telephone',
    type: ['Credential', 'ProofOfMobilePhoneNumber'],
    name: 'Mobile Phone Number',
    context: [
      'https://w3id.org/identity/v1',
      'https://identity.jolocom.com/terms',
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
