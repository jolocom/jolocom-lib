import { BaseMetadata } from "cred-types-jolocom-core";

export const singleClaimCreationArgs = {
  email: 'eugeniu@jolocom.com'
}

export const multipleClaimsCreationArgs = {
  givenName: 'Eugeniu',
  familyName: 'Rusu'
}

export interface ClaimInterface extends BaseMetadata{
  claimInterface?: {
    age: string
  }
}

export const customClaimMetadata: ClaimInterface = {
  context: ['http://test.com', {test: 'http://test.com/terms'}],
  type: ['Credential', 'MockCredential'],
  name: 'Mock'
}

export const customCredentialCreationArgs = {
  id: 'did:jolo:test',
  test: 'first',
  secondTest: 'second'
}

export const singleClaimCredentialJSON = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  'type': ['Credential', 'ProofOfEmailCredential'],
  'claim': { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  'name': 'Email address'
}

export const multipleClaimsCredentialJSON = {
  '@context': [
    {'ProofOfEmailCredential': "https://identity.jolocom.com/terms/ProofOfEmailCredential"}
  ],
  'type': ['Credential', 'ProofOfNameCredential'],
  'claim': { id: 'did:jolo:test', givenName: 'Eugeniu', familyName: 'Rusu' },
  'name': 'Name'
}

export const customCredentialJSON = {
  '@context': ['http://test.com'],
  'type': ['Credential', 'MockCredential'],
  'claim': { id: 'did:jolo:test', age: '20' },
  'name': 'Mock'
}
