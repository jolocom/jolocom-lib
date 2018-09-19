import { InteractionType } from '../../../ts/interactionFlows/types'

export const credentialRequestPayloadJson = {
  typ: InteractionType.CredentialRequest.toString(),
  credentialRequest: {
    callbackURL: 'http://test.com',
    credentialRequirements: [
      {
        type: ['Credential', 'MockCredential'],
        constraints: [{ '==': [
          { var: 'issuer' },
          'did:jolo:issuer'
        ] }]
      }
    ]
  }
}

export const credentialRequestJson = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      constraints: {
        and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
      },
      type: ['Credential', 'MockCredential']
    }
  ]
}

export const expectedRequestedCredentials = {
  type: ['Credential', 'MockCredential'],
  constraints: {
    and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
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

export const credentialRequestCreationAttrs = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'MockCredential'],
      constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
    }
  ]
}

export const mockPrivKey = '3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
export const privKeyDID = 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'

export const signedCredReqJson = {
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    iat: 0,
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    credentialRequest: {
      credentialRequirements: [
        {
          type: ['Credential', 'MockCredential'],
          constraints: {
            and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
          }
        }
      ],
      callbackURL: 'http://test.com'
    }
  },
  signature: 'lBcEgnfpORwlZGZ1HanoW2d3Ngm2qox-JI4T0iL-m1fBt5f6ihAvaoj0Z2usZiXwO5UtKXvvcvJTEP6rxI_MDQ'
}

export const signedCredReqJWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpYXQiOjAsImlzcyI6ImRpZDpqb2xvOjhmOTc3ZTUwYjdlNWNiZGZlYjUzYTAzYzgxMjkxM2I3Mjk3\
OGNhMzVjOTM1NzFmODVlODYyODYyYmFjOGNkZWIiLCJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50\
aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJNb2NrQ3JlZGVudGlhbCJdLCJj\
b25zdHJhaW50cyI6eyJhbmQiOlt7Ij09IjpbdHJ1ZSx0cnVlXX0seyI9PSI6W3sidmFyIjoiaXNzdWVy\
In0sImRpZDpqb2xvOmlzc3VlciJdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL3Rlc3QuY29tIn19\
.lBcEgnfpORwlZGZ1HanoW2d3Ngm2qox-JI4T0iL-m1fBt5f6ihAvaoj0Z2usZiXwO5UtKXvvcvJTEP6\
rxI_MDQ'