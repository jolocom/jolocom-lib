export const credentialRequestCreationArgs = {
  callbackURL: 'http://test.com',
  requestedCredentials: [{
    type: ['Credential', 'ProofOfNameCredential'],
    constraints: [{'==': [{var: 'issuer'}, 'did:jolo:issuer']}]
  }]
}

export const credentialRequestJson = {
  callbackURL: 'http://test.com',
  requestedCredentials: [{
    constraints: {
      and: [
        { '==': [ true, true ] },
        { '==': [ { var: 'issuer' }, 'did:jolo:issuer' ] }
      ]
    },
    type: [
      'Credential',
      'ProofOfNameCredential'
    ]
  }]
}

export const firstMockCredential = {
  '@context': [],
  'id': '',
  'issuer': 'did:jolo:issuer',
  'claim': { id: '' },
  'issued': '',
  'type': ['Credential', 'ProofOfNameCredential'],
  'proof': {
    created: new Date(),
    creator: '',
    nonce: '',
    signatureValue: '',
    type: ''
  }
}

export const secondMockCredential = Object.assign({}, firstMockCredential, {issuer: 'did:jolo:different'})
