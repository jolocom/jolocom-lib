import { mockEmailCredCreationAttrs } from './credential'
import { claimsMetadata } from 'cred-types-jolocom-core'
import { defaultContext } from '../../../ts/utils/contexts'

export const mockKeyId = 'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1'
export const mockSubjectKey = 'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const mockIssuerDid = 'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

export const testSignedCredentialCreateArgs = {
  metadata: claimsMetadata.emailAddress,
  claim: mockEmailCredCreationAttrs.claim,
  issuerDid: mockIssuerDid,
  keyId: mockKeyId,
  subject: mockSubjectKey
}

export const emailVerifiableCredentialHash = '3f374ae2978e56cdcd985dd27f0067ff31929a45350e61cb09985b3c8dd50d0a'
export const emailVerifiableCredential = {
  '@context': [
    {
      id: '@id',
      type: '@type',
      cred: 'https://w3id.org/credentials#',
      schema: 'http://schema.org/',
      dc: 'http://purl.org/dc/terms/',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      sec: 'https://w3id.org/security#',
      Credential: 'cred:Credential',
      issuer: { '@id': 'cred:issuer', '@type': '@id' },
      issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
      claim: { '@id': 'cred:claim', '@type': '@id' },
      credential: { '@id': 'cred:credential', '@type': '@id' },
      expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
      proof: { '@id': 'sec:proof', '@type': '@id' },
      EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
      created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
      creator: { '@id': 'dc:creator', '@type': '@id' },
      domain: 'sec:domain',
      nonce: 'sec:nonce',
      signatureValue: 'sec:signatureValue'
    },
    {
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email'
    }
  ],
  id: 'claimId:567e6e0c6570a',
  name: 'Email address',
  issuer: 'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { email: 'test@jolocom.io', id: 'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
  issued: '1970-01-01T00:00:00.000Z',
  expires: '1971-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: 'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1',
    nonce: '1842fb5f567dd532',
    signatureValue: '',
    created: '1970-01-01T00:00:00.000Z'
  }
}
export const testSignedCredential = {
  '@context': [
    'https://w3id.org/identity/v1',
    'https://identity.jolocom.com/terms',
    'https://w3id.org/security/v1',
    'https://w3id.org/credentials/v1',
    'http://schema.org'
  ],
  id: 'claimId:9dc39ffb9c78f',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1975-01-01T00:00:00.000Z',
  expires: '2070-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1975-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: 'ae3b07329969',
    signatureValue: 'iHxfRLbRJmreC5IjgGmWARGPje0biG045T9HXN0ImzsEU35rJKci5FvH8/cCeDEBjBe7Bfw3LanL+3SzBcb/Rg=='
  }
}
export const testSignedCredentialDefault = {
  '@context': [
    {
      id: '@id',
      type: '@type',
      cred: 'https://w3id.org/credentials#',
      schema: 'http://schema.org/',
      dc: 'http://purl.org/dc/terms/',
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      sec: 'https://w3id.org/security#',
      Credential: 'cred:Credential',
      issuer: { '@id': 'cred:issuer', '@type': '@id' },
      issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
      claim: { '@id': 'cred:claim', '@type': '@id' },
      credential: { '@id': 'cred:credential', '@type': '@id' },
      expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
      proof: { '@id': 'sec:proof', '@type': '@id' },
      EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
      created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
      creator: { '@id': 'dc:creator', '@type': '@id' },
      domain: 'sec:domain',
      nonce: 'sec:nonce',
      signatureValue: 'sec:signatureValue'
    },
    {
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email'
    }
  ],
  id: 'claimId:61adc6e7b1448',
  name: 'Email address',
  issuer: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88',
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { email: 'test@jolocom.com', id: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88' },
  issued: '2018-10-15T19:59:38.405Z',
  expires: '2019-10-15T19:59:38.406Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '2018-10-15T19:59:38.406Z',
    creator: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88#keys-1',
    nonce: 'c9c8bc35382ff',
    signatureValue: 'XdEIMGeo+b3eJEb2I063iLwShhAbWQNiwPILRy5XtN0TgU/bUB2mATmYrWGGIJfNbUEwh+kMn/gAQLLXoqr17A=='
  }
}

export const testSignedCredentialDefaultIncorrect = {
  '@context': [
    'https://w3id.org/identity/v1',
    {
      proof: 'https://w3id.org/security#proof'
    },
    {
      ProofOfEmailCredential: 'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email'
    }
  ],
  id: 'claimId:f97f39fa496cd',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: '1975-01-01T00:00:00.000Z',
  expires: '2070-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1975-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: '0965c9f1f1848',
    signatureValue: 'helloCe+r9pcl/zi0s+z/QXYdkJ6m4Ic+q9CCCRYkJIUVg2xcqKBaNe4Yr72dqabe0NzEiluRajJkyiRVgDtcQ=='
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
  issued: '2017-01-01T00:00:00.000Z',
  expires: '2027-01-01T00:00:00.000Z',
  type: ['Credential', 'MockCredential'],
  proof: {
    created: '1975-01-01T00:00:00.000Z',
    creator: 'did:jolo:issuer/keys#1',
    nonce: '00000',
    signatureValue: 'invalidMockSignature',
    type: 'mockType'
  }
}

export const secondMockCredential = Object.assign({}, firstMockCredential, {
  issuer: 'did:jolo:different'
})

export const thirdMockCredential = {
  '@context': defaultContext,
  id: 'claimId:bcf70ac9c940e',
  name: 'Email address',
  issuer: 'did:jolo:issuer',
  type: ['Credential', 'MockCredential'],
  claim: {
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    email: 'testUser@jolocom.com'
  },
  issued: '1975-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    created: '1975-01-01T00:00:00.000Z',
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: '90a6764469fc4',
    signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
  }
}
