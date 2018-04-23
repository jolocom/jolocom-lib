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
    type: ['Credential', 'EmailAddressCredentail']
  },
  mobilePhoneNumber: {
    fieldName: 'telephone',
    type: ['Credential', 'MobileNumberCredential']
  }
}

export enum keyTypes {
  jolocomIdentityKey = 'm/73\'/0\'/0\'/0',
  ethereumKey = 'm/44\'/60\'/0\'/0/0'
}
