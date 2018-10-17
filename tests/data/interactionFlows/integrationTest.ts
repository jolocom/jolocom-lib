import { defaultContext } from './../../../ts/utils/contexts'
import { IIpfsConfig } from '../../../js/ipfs/types';

export const ethereumConfigProviderUrl = 'http://127.0.0.1:8945'

export const integrationTestIpfsConfig: IIpfsConfig = {
  protocol: 'http',
  port: 5001,
  host: '127.0.0.1'
}

export const sampleDid = 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'

export const testClaim = {
  name: 'Test Name',
  description: 'Test Description'
}

export const samplePublicProfile = {
  id: sampleDid,
  name: 'Test Name',
  description: 'Test Description'
}

export const testSignedCreds = [{
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
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#claimId:bcf70ac9c940e',
    nonce: '90a6764469fc4',
    signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
  }
},
{
  '@context': defaultContext,
  id: 'claimId:bcf70ac9c940e',
  name: 'Email address',
  issuer: 'did:jolo:anotherIssuer',
  type: [ 'Credential', 'MockCredential' ],
  claim: {
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    email: 'testUser2@jolocom.com'
  },
  issued: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#claimId:bcf70ac9c940e',
    nonce: '90a6764469fc4',
    signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
  }
}]

export const sampleCredentialRequest = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: [ 'Credential', 'ProofOfEmailCredential' ],
      constraints: [
        { '==': [{ var: 'issuer' }, 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'] }
      ]
    }
  ]
}

export const testSignedCredentialIntegration = {
  '@context': [{
    id: '@id',
    type: '@type',
    cred: 'https://w3id.org/credentials#',
       schema: 'http://schema.org/',
       dc: 'http://purl.org/dc/terms/',
       xsd: 'http://www.w3.org/2001/XMLSchema#',
       sec: 'https://w3id.org/security#',
       Credential: 'cred:Credential',
       issuer: { '@id': 'cred:issuer', '@type': '@id' },
        issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
      claim: { '@id': 'cred:claim', '@type': '@id' },
      credential: { '@id': 'cred:credential', '@type': '@id' },
      expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
      proof: { '@id': 'sec:proof', '@type': '@id' },
       EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
       created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
      creator: { '@id': 'dc:creator', '@type': '@id' },
       domain: 'sec:domain',
       nonce: 'sec:nonce',
       signatureValue: 'sec:signatureValue' },
     { ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
       schema: 'http://schema.org/',
       email: 'schema:email' } ],
  id: 'claimId:81a4be40cad75',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { email: 'eugeniu@jolocom.com', id: 'did:jolo:test' },
  issued: '2018-10-17T09:22:09.637Z',
  expires: '2019-10-17T09:22:09.637Z',
  proof:
   { type: 'EcdsaKoblitzSignature2016',
     created: '2018-10-17T09:22:09.637Z',
     creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
     nonce: '2c1691bc62baf',
     signatureValue: '/xb/eR7VsiY0kpcQNwKiesROLH1jy7ud/fmNqRb7fkJriDCz2WOL54fZOtjORAPaBrLucKB5cgTlkVf/afmlnA==' }
}
