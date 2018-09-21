import { singleClaimCreationArgs } from './credential'
import { testPrivateIdentityKey } from '../keys'
import { claimsMetadata } from 'cred-types-jolocom-core'

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