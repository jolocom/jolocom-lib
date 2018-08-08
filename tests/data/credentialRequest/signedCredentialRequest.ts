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

export const signedCredReqJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpYXQiOjAsImlzcyI6ImRpZDpqb2xvOjhmOTc3ZTUwYjdlNWNiZGZlYjUzYTAzYzgxMjkxM2I3Mjk3\
OGNhMzVjOTM1NzFmODVlODYyODYyYmFjOGNkZWIiLCJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50\
aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJNb2NrQ3JlZGVudGlhbCJdLCJj\
b25zdHJhaW50cyI6eyJhbmQiOlt7Ij09IjpbdHJ1ZSx0cnVlXX0seyI9PSI6W3sidmFyIjoiaXNzdWVy\
In0sImRpZDpqb2xvOmlzc3VlciJdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL3Rlc3QuY29tIn19\
.lBcEgnfpORwlZGZ1HanoW2d3Ngm2qox-JI4T0iL-m1fBt5f6ihAvaoj0Z2usZiXwO5UtKXvvcvJTEP6\
rxI_MDQ'

export const ddoAttr = {
  '@context': 'https://w3id.org/did/v1',
  'id': 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  'authentication': [
    {
      id: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1'
    }
  ],
  'publicKey': [
    {
      id: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1',
      publicKeyHex: '039ab801fef81ad6928c62ca885b1f62c01a493daf58a0f7c76026d44d1d31f163'
    }
  ],
  'service': [
    {
      id: 'public',
      type: ['PublicProfile'],
      serviceEndpoint: 'ipfs://kjnwe6938uj3m2l3h',
      description: 'my public profile'
    }
  ],
  'created': new Date('2018-01-24T15:42:15Z')
}