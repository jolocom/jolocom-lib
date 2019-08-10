import { BaseMetadata, claimsMetadata } from 'cred-types-jolocom-core'
import {signedCredentialContext} from '../../../ts/utils/contexts'

/* Defining custom metadata objects for custom credentials */

interface IBirthDateClaimInterface extends BaseMetadata {
  claimInterface?: {
    birthDate: number
    birthMonth: string
    birthYear: number
  }
}

export interface INestedAddressClaimInterface extends BaseMetadata {
  claimInterface?: {
    address: {
      street: string
      postalCode: string
      city: string
    }
  }
}

const customClaimMetadata: IBirthDateClaimInterface = {
  context: ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'MockCredential'],
  name: 'Mock',
}

const nestedAddressClaimMetadata: INestedAddressClaimInterface = {
  context: ['http://test.com', { test: 'http://test.com/terms' }],
  type: ['Credential', 'ProofOfAddressCredential'],
  name: 'Address',
}

/* Defining mock user data to reuse later */

const mockSubject =
  'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const mockEmail = 'test@jolocom.io'
const mockName = {
  givenName: 'MockName',
  familyName: 'MockFamName',
}

const mockAddress = {
  address: {
    street: 'Kopenicker Str 147',
    postalCode: '10829',
    city: 'Berlin',
  },
}

const mockBirthday = {
  birthDate: 20,
  birthMonth: 'april',
  birthYear: 1984,
}

/* Preparing credential creation attributes for easy instantiation */

export const mockEmailCredCreationAttrs = {
  metadata: claimsMetadata.emailAddress,
  subject: mockSubject,
  claim: {
    email: mockEmail,
  },
}

export const mockNameCredCreationAttrs = {
  metadata: claimsMetadata.name,
  subject: mockSubject,
  claim: mockName,
}

export const mockAddrCredCreationAttrs = {
  metadata: nestedAddressClaimMetadata,
  subject: mockSubject,
  claim: mockAddress,
}

export const mockBirthdayCredCreationAttrs = {
  metadata: customClaimMetadata,
  subject: mockSubject,
  claim: mockBirthday,
}

/* JSON form to ensure toJSON and fromJSON work as intended */

export const emailCredentialJSON = {
  '@context': [
    ...signedCredentialContext,
    {
      email: 'schema:email',
      schema: 'http://schema.org/',
      ProofOfEmailCredential:
        'https://identity.jolocom.com/terms/ProofOfEmailCredential',
    },
  ],
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: {
    email: mockEmail,
    id: mockSubject,
  },
  name: 'Email address',
}

export const nameCredentialJSON = {
  '@context': [
    ...signedCredentialContext,
    {
      ProofOfNameCredential:
        'https://identity.jolocom.com/terms/ProofOfNameCredential',
      familyName: 'schema:familyName',
      givenName: 'schema:givenName',
      schema: 'http://schema.org/',
    },
  ],
  type: ['Credential', 'ProofOfNameCredential'],
  claim: {
    ...mockName,
    id: mockSubject,
  },
  name: 'Name',
}

export const birthdayCredentialJSON = {
  '@context': [
    ...signedCredentialContext,
    'http://test.com',
    { test: 'http://test.com/terms' },
  ],
  type: ['Credential', 'MockCredential'],
  claim: {
    ...mockBirthday,
    id: mockSubject,
  },
  name: 'Mock',
}

export const addressCredentialJSON = {
  '@context': [
    ...signedCredentialContext,
    'http://test.com',
    { test: 'http://test.com/terms' },
  ],
  type: ['Credential', 'ProofOfAddressCredential'],
  claim: {
    ...mockAddress,
    id: mockSubject,
  },
  name: 'Address',
}
