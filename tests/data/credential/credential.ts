export const singleClaimCreationArgs = {
  id: 'did:jolo:test',
  email: 'eugeniu@jolocom.com'
}

export const multipleClaimsCreationArgs = {
  id: 'did:jolo:test',
  givenName: 'Eugeniu',
  familyName: 'Rusu'
}

export const customClaimMetadata = {
  context: ['http://test.com'],
  fieldNames: ['test', 'secondTest'],
  optionalFieldNames: [],
  type: ['Credential', 'MockCredential'],
  name: 'Mock'
}

export const customCredentialCreationArgs = {
  id: 'did:jolo:test',
  test: 'first',
  secondTest: 'second'
}

export const singleClaimCredentialJSON = {
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

export const multipleClaimsCredentialJSON = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  'type': ['Credential', 'ProofOfNameCredential'],
  'claim': { id: 'did:jolo:test', givenName: 'Eugeniu', familyName: 'Rusu' },
  'name': 'Name'
}

export const customCredentialJSON = {
  '@context': ['http://test.com'],
  'type': ['Credential', 'MockCredential'],
  'claim': { id: 'did:jolo:test', test: 'first', secondTest: 'second' },
  'name': 'Mock'
}
