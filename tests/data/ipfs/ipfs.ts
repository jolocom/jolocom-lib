export const localHostStorage = 'http://localhost:5001'

export const pinBoolean =  true

export const testDataObject = { data: 'testData' }

export const testDataString = 'testData'

export const testHash = 'Qm12345'

export const testDDO = {
  'authentication':
    [ {
      id: 'did:jolo:5e24e1d34301a139f5d3f4a706b7d050738849729317a94a1ed9a30c5ac72787#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1' } ],
  'publicKey':
    [ {
      id: 'did:jolo:5e24e1d34301a139f5d3f4a706b7d050738849729317a94a1ed9a30c5ac72787#keys-1',
      type: 'EdDsaSAPublicKeySecp256k1',
      // tslint:disable-next-line:max-line-length
      publicKeyHex: '303366646435376164656333643433386561323337666534366233336565316530313665646136623538356333653237656136363638366332656135333538343739' } ],
  '@context': 'https://w3id.org/did/v1',
  'created': '2018-06-21T09:53:34.857Z',
  'id': 'did:jolo:5e24e1d34301a139f5d3f4a706b7d050738849729317a94a1ed9a30c5ac72787'
}

export const expectedCredential = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  'type': ['Credential', 'ProofOfEmailCredential'],
  'claim': { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  'name': 'Email address'
}
