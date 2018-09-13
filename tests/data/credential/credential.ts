import { BaseMetadata } from 'cred-types-jolocom-core'

export const singleClaimCreationArgs = {
  email: 'eugeniu@jolocom.com'
}

export const multipleClaimsCreationArgs = {
  givenName: 'Eugeniu',
  familyName: 'Rusu'
}

export interface ClaimInterface extends BaseMetadata {
  claimInterface?: {
    birthDate: number
    birthMonth: string
    birthYear: number
  }
}

export const customClaimMetadata: ClaimInterface = {
  context: ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'MockCredential'],
  name: 'Mock'
}

export const customCredentialCreationArgs = {
  id: 'did:jolo:test',
  test: 'first',
  secondTest: 'second'
}

export const singleClaimCredentialJSON = {
  '@context': [{ ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential' }],
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  name: 'Email address'
}

export const multipleClaimsCredentialJSON = {
  '@context': [{ ProofOfNameCredential: 'https://identity.jolocom.com/terms/ProofOfNameCredential' }],
  type: ['Credential', 'ProofOfNameCredential'],
  claim: { id: 'did:jolo:test', givenName: 'Eugeniu', familyName: 'Rusu' },
  name: 'Name'
}

export const customCredentialJSON = {
  '@context': ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'MockCredential'],
  claim: { id: 'did:jolo:test', birthDate: 20, birthMonth: 'april', birthYear: 1984 },
  name: 'Mock'
}
