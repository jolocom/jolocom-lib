import { credentialResponsePayloadJson } from './credentialResponse';
import { firstMockCredential } from '../credentialRequest/credentialRequest'

export const mockSuppliedCredentials = [{
  type: firstMockCredential.type,
  credential: firstMockCredential
}]
export const mockSignedCredResponseJson = {
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    iat: 0,
    credentialResponse: {
      suppliedCredentials: [
        {
          type: ['Credential', 'MockCredential'],
          credential: {
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
        }
      ]
    }
  },
  signature: '8J4ntVxXvJIpt3uGpSkMwUuxWFdLmZH_BVrNbE7KlkCcp65GXE0Q-pG5X2fmgsF2JoXGxogxvrWNykjq4o9joA'
}
