import { defaultContext } from '../../ts/utils/contexts'

/* Saves space later */

const publicProfileCreationArgs = {
  name: 'User name',
  description: 'User description',
  url: 'http://mock.com',
  image: 'http://mock.com/img.jpg',
  id:
    'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
}

/* JSON form to ensure toJSON and fromJSON work as intended */

export const publicProfileCredJSON = {
  '@context': [
    ...defaultContext,
    {
      PublicProfileCredential:
        'https://identity.jolocom.com/terms/PublicProfileCredential',
      schema: 'http://schema.org/',
      name: 'schema:name',
      description: 'schema:description',
      image: 'schema:image',
      url: 'schema:url',
    },
  ],
  id: 'claimId:1b96cd3242572',
  name: 'Public Profile',
  issuer:
    'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
  type: ['Credential', 'PublicProfileCredential'],
  claim: publicProfileCreationArgs,
  issued: '1970-01-01T00:00:00.000Z',
  expires: '1971-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator:
      'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
    nonce: '5aaaee696a03b370',
    signatureValue:
      '2b8504698e1feb105b14e6adf2f446a20baf5338dab96c1eff7db951cf73529f61c35e7d86a1954284fc193f3e85b7adea6976bd0ded39cd31a296cd0469b6ad',
    created: '1970-01-01T00:00:00.000Z',
  },
}

export const emailCredential = {
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
      signatureValue: 'sec:signatureValue',
    },
    {
      ProofOfEmailCredential:
        'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email',
    },
  ],
  id: 'claimId:8e1b22158e408',
  issuer:
    'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
  issued: '2019-01-21T13:37:20.413Z',
  type: ['Credential', 'ProofOfEmailCredential'],
  expires: '2020-01-21T13:37:20.413Z',
  proof: {
    created: '2019-01-21T13:37:20.412Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: '0eef4bf49f8fb20b',
    signatureValue:
      '9573d901ed327859c70f531b67866bd81d3f9cdb4cc58738a6bb43972cfba5d41ac3cca38084e4c23dd2556c752d22e8df2fff239f04b675dec2b97bb427a657',
    creator:
      'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
  },
  claim: {
    email: 'example@example.com',
    id:
      'did:jolo:6d6f636b207375626a656374206469646d6f636b207375626a65637420646964',
  },
  name: 'Email address',
}
