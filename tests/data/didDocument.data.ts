import { defaultContextIdentity } from '../../ts/utils/contexts'

export const mockDid =
  'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
export const mockIpfsHash = 'QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js'
export const mockKeyId = `${mockDid}#keys-1`
export const mockPublicKeyHex =
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551'

/* JSON form to ensure toJSON and fromJSON work as intended */

export const didDocumentJSON = {
  authentication: [mockKeyId],
  publicKey: [
    {
      id: mockKeyId,
      type: 'Secp256k1VerificationKey2018',
      controller: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  service: [],
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
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/did#updated> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> "did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#publicKey> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> .\n'
