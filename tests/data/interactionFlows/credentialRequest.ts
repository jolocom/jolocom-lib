import { InteractionType } from '../../../ts/interactionFlows/types'

export const credentialRequestPayloadJson = {
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  iat: 0,
  typ: InteractionType.CredentialRequest,
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

// do we need this mock data? if yes, lets move this to identity file
export const ddoAttr = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:jolo:ffcc8f84fae1b6ad253561d7b78167a661d72f58e86e60dbd04cd9b81096cdbe',
  publicKey: [
    {
      id: 'did:jolo:ffcc8f84fae1b6ad253561d7b78167a661d72f58e86e60dbd04cd9b81096cdbe#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex: '0343b964ac4be48b304d08aa5fc41513cbbf6a9587c687114145bf4740ce079f69'
    }
  ],
  authentication: [
    {
      publicKey: 'did:jolo:ffcc8f84fae1b6ad253561d7b78167a661d72f58e86e60dbd04cd9b81096cdbe#keys-1',
      type: 'Secp256k1SignatureAuthentication2018'
    }
  ],
  service: [],
  created: new Date('2018-01-24T15:42:15Z'),
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '2018-08-15T13:14:10.115Z',
    creator: 'did:jolo:ffcc8f84fae1b6ad253561d7b78167a661d72f58e86e60dbd04cd9b81096cdbe#keys-1',
    nonce: '01fe24f91466b',
    signatureValue: 'N1e+NpgJICu8/UZFwlHEvpucFLKIY44LKhJ/oR9ZsBQQEn9ZPO2Tu7q+TN9LJvCM13ERk4z3xYwyfTgzaEV74Q=='
  },
}
