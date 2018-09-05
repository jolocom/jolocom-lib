import 'reflect-metadata'
import { IDefaultClaimsMetadata } from './credentials/credential/types'
import { parse } from './parse/parser'
import { Credential } from './credentials/credential/credential'
import { registries } from './registries'
import { IdentityManager } from './identityManager/identityManager';
import { JSONWebToken } from './interactionFlows/jsonWebToken';

export const JolocomLib = {
  parse,
  registry : registries,
  identityManager : {
    create: IdentityManager.create
  },
  unsigned : {
    createCredential: Credential.create,
    createInteractionJSONWebToken: JSONWebToken.create,
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
    fieldNames: ['name', 'description'],
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
