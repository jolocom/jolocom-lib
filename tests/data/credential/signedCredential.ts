import { singleClaimCreationArgs } from './credential'
import { testPrivateIdentityKey } from '../keys'
import { claimsMetadata } from 'cred-types-jolocom-core'
import { defaultContext } from '../../../ts/utils/contexts'

export const testSignedCredentialCreateArgs = {
  metadata: claimsMetadata.emailAddress,
  claim: singleClaimCreationArgs,
  privateIdentityKey: {
    key: testPrivateIdentityKey,
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1'
  },
  subject: 'did:jolo:test'
}

export const testSignedCredential = {
  '@context': 
  [ 'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org' ],
   id: 'claimId:9dc39ffb9c78f',
   name: 'Email address',
   issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
   type: [ 'Credential', 'ProofOfEmailCredential' ],
   claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
   issued: '1970-01-01T00:00:00.000Z',
   expires: undefined,
   proof: 
   { type: 'EcdsaKoblitzSignature2016',
     created: '1970-01-01T00:00:00.000Z',
     creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
     nonce: 'ae3b07329969',
     signatureValue: 'iHxfRLbRJmreC5IjgGmWARGPje0biG045T9HXN0ImzsEU35rJKci5FvH8/cCeDEBjBe7Bfw3LanL+3SzBcb/Rg==' }
}

export const testSignedCredentialDefault = {
  '@context': [
    'https://w3id.org/identity/v1',
    {
      proof: 'https://w3id.org/security#proof'
    }, {
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email'
    }
  ],
  id: 'claimId:f97f39fa496cd',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1970-01-01T00:00:00.000Z',
  expires: undefined,
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: '0965c9f1f1848',
    signatureValue: 'h9b7PCe+r9pcl/zi0s+z/QXYdkJ6m4Ic+q9CCCRYkJIUVg2xcqKBaNe4Yr72dqabe0NzEiluRajJkyiRVgDtcQ=='
  }
}

export const testSignedCredentialDefaultNegative = {
  '@context': [
    'https://w3id.org/identity/v1',
    {
      proof: 'https://w3id.org/security#proof'
    }, {
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email'
    }
  ],
  id: 'claimId:f97f39fa496cd',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1970-01-01T00:00:00.000Z',
  expires: undefined,
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: '0965c9f1f1848',
    signatureValue: 'helloCe+r9pcl/zi0s+z/QXYdkJ6m4Ic+q9CCCRYkJIUVg2xcqKBaNe4Yr72dqabe0NzEiluRajJkyiRVgDtcQ=='
  }
}

export const firstMockCredential = {
  '@context': ['http://schema.org/'],
  id: 'claim:id:test',
  issuer: 'did:jolo:issuer',
  claim: {
    id: 'did:jolo:subject',
    mock: 'value'
  },
  issued: '',
  type: ['Credential', 'MockCredential'],
  proof: {
    created: '1970-01-01T00:00:00.000Z',
    creator: 'did:jolo:issuer/keys#1',
    nonce: '00000',
    signatureValue: 'invalidMockSignature',
    type: 'mockType'
  }
}

export const secondMockCredential = Object.assign({}, firstMockCredential, {
  issuer: 'did:jolo:different'
})

export const thirdMockCredential = {
  '@context': defaultContext,
  id: 'claimId:bcf70ac9c940e',
  name: 'Email address',
  issuer: 'did:jolo:issuer',
  type: [ 'Credential', 'MockCredential' ],
  claim: {
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    email: 'testUser@jolocom.com'
  },
  issued: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: '90a6764469fc4',
    signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
  }
}