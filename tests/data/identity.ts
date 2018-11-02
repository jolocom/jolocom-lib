import { defaultContext } from '../../ts/utils/contexts'

/* Defining mock arguments to pass to creation functions in tests */

export const publicProfileCreationArgs = {
  name: 'User name',
  description: 'User description',
  url: 'http://mock.com',
  image: 'http://mock.com/img.jpg',
  id: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
}

/* JSON form to ensure toJSON and fromJSON work as intended */

export const publicProfileCredJSON = {
  '@context': [
    ...defaultContext,
    {
      PublicProfileCredential: 'https://identity.jolocom.com/terms/PublicProfileCredential',
      schema: 'http://schema.org/',
      name: 'schema:name',
      description: 'schema:description',
      image: 'schema:image',
      url: 'schema:url'
    }
  ],
  id: 'claimId:1b96cd3242572',
  name: 'Public Profile',
  issuer: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
  type: ['Credential', 'PublicProfileCredential'],
  claim: publicProfileCreationArgs,
  issued: '1970-01-01T00:00:00.000Z',
  expires: '1971-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
    nonce: '5aaaee696a03b370',
    signatureValue:
      '2b8504698e1feb105b14e6adf2f446a20baf5338dab96c1eff7db951cf73529f61c35e7d86a1954284fc193f3e85b7adea6976bd0ded39cd31a296cd0469b6ad',
    created: '1970-01-01T00:00:00.000Z'
  }
}