import { InteractionType } from '../../../ts/interactionFlows/types'

export const credentialResponsePayloadJson = {
  iat: 0,
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  typ: InteractionType.CredentialResponse,
  credentialResponse: {
    suppliedCredentials: [
      {
        type: ['Credential', 'MockCredential'],
        credential: {
          '@context': ['http://schema.org/'],
          id: 'claim:id:test',
          issuer: 'did:jolo:issuer',
          issued: 'this date',
          type: ['Credential', 'MockCredential'],
          claim: {
            id: 'did:jolo:subject',
            mock: 'value'
          },
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
}
