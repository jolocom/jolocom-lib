import { BaseMetadata } from 'cred-types-jolocom-core'
import { defaultContext } from '../../../ts/utils/contexts'

export const singleClaimCreationArgs = {
  email: 'eugeniu@jolocom.com'
}

export const multipleClaimsCreationArgs = {
  givenName: 'Eugeniu',
  familyName: 'Rusu'
}

export const addressClaimCreationArgs = {
  address: {
    street: 'Kopenicker Str 147',
    postalCode: '10829',
    city: 'Berlin'
  }
}

export interface IBirthDateClaimInterface extends BaseMetadata {
  claimInterface?: {
    birthDate: number
    birthMonth: string
    birthYear: number
  }
}

export interface INestedAddressClaimInterface extends BaseMetadata {
  claimInterface?: {
    address: {
      street: string,
      postalCode: string,
      city: string
    }
  }
}

export const customClaimMetadata: IBirthDateClaimInterface = {
  context: ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'MockCredential'],
  name: 'Mock'
}

export const nestedAddressClaimMetadata: INestedAddressClaimInterface = {
  context: ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'ProofOfAddressCredential'],
  name: 'Address'
}

export const customCredentialCreationArgs = {
  id: 'did:jolo:test',
  test: 'first',
  secondTest: 'second'
}

export const singleClaimCredentialJSON = {
  '@context': [
    ...defaultContext,
    {
      email: 'schema:email',
      schema: 'http://schema.org/',
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential'
    }
  ],
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: {
    id: 'did:jolo:test',
    email: 'eugeniu@jolocom.com'
  },
  name: 'Email address'
}

export const multipleClaimsCredentialJSON = {
  '@context': [
    ...defaultContext,
    {
      ProofOfNameCredential: 'https://identity.jolocom.com/terms/ProofOfNameCredential',
      familyName: 'schema:familyName',
      givenName: 'schema:givenName',
      schema: 'http://schema.org/'
    }
  ],
  type: ['Credential', 'ProofOfNameCredential'],
  claim: {
    id: 'did:jolo:test',
    givenName: 'Eugeniu',
    familyName: 'Rusu'
  },
  name: 'Name'
}

export const customCredentialJSON = {
  '@context': [...defaultContext, 'http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'MockCredential'],
  claim: {
    id: 'did:jolo:test',
    birthDate: 20,
    birthMonth: 'april',
    birthYear: 1984
  },
  name: 'Mock'
}

export const addressCredentialJSON = {
  '@context': [...defaultContext, 'http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'ProofOfAddressCredential'],
  claim: {
    address: {
      street: 'Kopenicker Str 147',
      postalCode: '10829',
      city: 'Berlin'
    },
    id: 'did:jolo:test'
  },
  name: 'Address'
}
