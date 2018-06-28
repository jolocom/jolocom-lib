export const ddoAttr = {
  '@context': 'https://w3id.org/did/v1',
  'id': 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  'authentication': [
    {
      id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1'
    }
  ],
  'publicKey': [
    {
      id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1',
      publicKeyHex: '039ab801fef81ad6928c62ca885b1f62c01a493daf58a0f7c76026d44d1d31f163'
    }
  ],
  'service': [
    {
      id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af;public',
      type: ['PublicProfile'],
      serviceEndpoint: 'ipfshash',
      description: 'my public profile'
    }
  ],
  'created': new Date('2018-01-24T15:42:15Z')
}

export const publicClaimCreationArgs = {
  id: 'did:jolo:test',
  name: 'natascha',
  about: 'test public profile',
  image: 'https://test.de/image',
  url: 'https://test.de'
}

export const publicProfileJSON = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  id: 'claimId:9867b6e2945a5',
  name: 'Public Profile',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'PublicProfileCredential' ],
  claim: {
    id: 'did:jolo:test',
    name: 'natascha',
    about: 'test public profile',
    image: 'https://test.de/image',
    url: 'https://test.de'
  },
  issued: '1970-01-01T00:00:00.000Z',
  expires: undefined,
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'undefined#claimId:9867b6e2945a5',
    nonce: '98615cd94f376',
    signatureValue: 'eCNNJ80RY46HkO7qtUbIV0POsumIoCMCrR2EpQvm+F5UQD3cVMzkAlcrzI2Ock7w2TTBkT00rZJrfFwIO0HdoQ=='
  }
}
