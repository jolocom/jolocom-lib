
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs } from '../data/credential/credential'

export const credentialAttr = {
  metadata:  claimsMetadata.emailAddress,
  claim: singleClaimCreationArgs
}

export const testSignedCred = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  id: 'claimId:bcf70ac9c940e',
  name: 'Email address',
  issuer: 'did:jolo:8ed0d21cf51f4a330c0bf660cb5fa81eb5c9d83c9f9e1263272cd2957f6a2029',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1970-01-01T00:00:00.000Z',
  expires: undefined,
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: new Date('1970-01-01T00:00:00.000Z'),
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#claimId:bcf70ac9c940e',
    nonce: '90a6764469fc4',
    signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
  }
}

export const testSignedCredRequest = {
  header: {
    alg: 'ES256K',
    typ: 'JWT'
  },
  payload: {
    iat: 0,
    iss: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    credentialRequest: {
      credentialRequirements: [
        {
          constraints: {
            and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
          },
          type: ['Credential', 'MockCredential']
        }
      ],
      callbackURL: 'http://test.com'
    }
  },
  signature: 'GlgdqXf950LfxDogzu_Vvkiv8l0YoDEOHNyE5lZzfeK8Ns7HFWfFmtZIcs5ZVz-fR9QK8ZhUIxUEU38GhGY0NA'
}