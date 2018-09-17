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
