import 'reflect-metadata'
import { ILibConfig } from './types'
import { IDefaultClaimsMetadata } from './credentials/credential/types'
import { defaultConfig } from './defaultConfig'
import { SSO } from './sso'
import { Parser } from './parse/parser'
import { Credential } from './credentials/credential/credential'
import { CredentialRequest } from './credentialRequest/credentialRequest'
import { CredentialResponse } from './credentialResponse/credentialResponse'
// TODO: include IdentityWallet to JolocomLib
export class JolocomLib {
  public sso: SSO
  public static parse = Parser

  public static unsigned = {
    createCredential: Credential.create,
    createCredentialRequest: CredentialRequest.create,
    createCredentialResponse: CredentialResponse.create
  }

  // TODO Creation process should be changed.
  constructor(config: ILibConfig = defaultConfig) {
    this.sso = new SSO()
  }
}

export const claimsMetadata: IDefaultClaimsMetadata = {
  emailAddress: {
    fieldNames: ['email'],
    optionalFieldNames: [],
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
    fieldNames: ['telephone'],
    optionalFieldNames: [],
    type: ['Credential', 'ProofOfMobilePhoneNumberCredential'],
    name: 'Mobile Phone Number',
    context: [
      'https://w3id.org/identity/v1',
      'https://identity.jolocom.com/terms',
      'https://w3id.org/security/v1',
      'https://w3id.org/credentials/v1',
      'http://schema.org'
    ]
  },
  name: {
    fieldNames: ['givenName', 'familyName'],
    optionalFieldNames: [],
    type: ['Credential', 'ProofOfNameCredential'],
    name: 'Name',
    context: [
      'https://w3id.org/identity/v1',
      'https://identity.jolocom.com/terms',
      'https://w3id.org/security/v1',
      'https://w3id.org/credentials/v1',
      'http://schema.org'
    ]
  },
  publicProfile: {
    fieldNames: ['name', 'about'],
    optionalFieldNames: ['image', 'url'],
    type: ['Credential', 'PublicProfileCredential'],
    name: 'Public Profile',
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
