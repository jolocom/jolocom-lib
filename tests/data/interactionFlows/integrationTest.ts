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
      constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'] }]
    }
  ]
}
