export const credentialRequestCreationArgs = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'MockCredential'],
      constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
    }
  ]
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
