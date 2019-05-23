import { defaultContextIdentity } from '../../ts/utils/contexts'

export const mockDid =
  'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
export const mockIpfsHash = 'QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js'
export const mockKeyId = `${mockDid}#keys-1`
export const mockKeyId2 = `${mockDid}#keys-2`
export const mockPublicKeyHex =
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551'

/* JSON form to ensure toJSON and fromJSON work as intended */

export const didDocumentJSON = {
  authentication: [
    mockKeyId,
    {
      id: mockKeyId2,
      type: 'Secp256k1VerificationKey2018',
      controller: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  publicKey: [
    {
      id: mockKeyId,
      type: 'Secp256k1VerificationKey2018',
      controller: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  service: [
    {
      id: `${mockDid}#jolocomPubProfile`,
      type: 'JolocomPublicProfile',
      serviceEndpoint: 'ipfs://QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js',
      description: 'Verifiable Credential describing entity profile',
    },
  ],
  created: '1970-01-01T00:00:00.000Z',
  updated: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f567dd532',
    signatureValue: '',
    created: '1970-01-01T00:00:00.000Z',
  },
  '@context': defaultContextIdentity,
  id: mockDid,
}

export const normalizedDidDocument =
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <http://schema.org/description> "Verifiable Credential describing entity profile" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <https://w3id.org/security#dfn-service-endpoints> "ipfs://QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/did#updated> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> "did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#publicKey> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#service-endpoints> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> .\n'
