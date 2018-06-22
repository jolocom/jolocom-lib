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
