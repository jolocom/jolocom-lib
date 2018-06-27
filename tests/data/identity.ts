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

export const signedCredJSON = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  id: 'claimId:60fd4d80915b9',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1970-01-01T00:00:00.000Z',
  expires: undefined,
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1970-01-01T00:00:00.000Z',
    creator: 'undefined#claimId:60fd4d80915b9',
    nonce: 'cc041f34b7be3',
    signatureValue: 'dXZ8qJAzhnjrVsxU4joiyMIt00Flzp5RA+flEan7gcN7Qz0K2q0645dr2KQKrfXouOygHKUU9GRL6Ciwm0TnMw=='
  }
}
