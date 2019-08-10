import { IDidDocumentAttrs } from '../../ts/identity/didDocument/types'
import { didDocumentContext } from '../../ts/utils/contexts'

export const mockDid =
  'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777'
export const mockIpfsHash = 'QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js'
export const mockKeyId = `${mockDid}#keys-1`
export const mockKeyId2 = `${mockDid}#keys-2`
export const mockPublicKeyHex =
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551'

/* JSON form to ensure toJSON and fromJSON work as intended */

export const didDocumentJSONv0: IDidDocumentAttrs = {
  authentication: [
    {
      publicKey: mockKeyId,
      type: 'Secp256k1SignatureAuthentication2018',
    },
  ],
  publicKey: [
    {
      id: mockKeyId,
      type: 'Secp256k1VerificationKey2018',
      owner: mockDid,
      publicKeyHex: mockPublicKeyHex,
    },
  ],
  service: [
    {
      id: `${mockDid};jolocomPubProfile`,
      type: 'JolocomPublicProfile',
      serviceEndpoint: `ipfs://${mockIpfsHash}`,
      description: 'Verifiable Credential describing entity profile',
    },
  ],
  created: '1970-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f',
    signatureValue:
      '3e4bca6a08643c4a67c02abd109accd19f2f9ad1c93cd9f39d3f23edc122de7a72d1de44420b456c20b1875ed254417efdf8dd16fb8ded818d830dac475ec55a',
    created: '1970-01-01T00:00:00.000Z',
  },
  '@context': didDocumentContext,
  id: mockDid,
}

export const didDocumentJSON: IDidDocumentAttrs = {
  specVersion: 0.13,
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
    nonce: '1842fb5f',
    signatureValue:
      'bd881b1b8509e25a14153662ce521268d297e9fccfb32c514c9ab7ffefb329a0547ba6dc1731bde5a74b4799ef992eb791e71deda1015e6fe425fabe75b80bc3',
    created: '1970-01-01T00:00:00.000Z',
  },
  '@context': didDocumentContext,
  id: mockDid,
}

export const normalizedDidDocument =
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <http://schema.org/description> "Verifiable Credential describing entity profile" .\n' +
  `<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://identity.jolocom.com/terms/PublicProfile> .\n`+
  `<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> <https://w3id.org/did#serviceEndpoint> <ipfs://QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js> .\n` +
  `<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#Secp256k1VerificationKey2018> .\n` +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  `<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#Secp256k1VerificationKey2018> .\n` +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#controller> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> <https://w3id.org/security#publicKeyHex> "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <http://schema.org/version> "1.3E-1"^^<http://www.w3.org/2001/XMLSchema#double> .\n' +
  `<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/did#service> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#jolocomPubProfile> .\n` +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/did#updated> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> "did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1" .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#authenticationMethod> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-2> .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#proof> _:c14n0 .\n' +
  '<did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777> <https://w3id.org/security#publicKey> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> .\n' +
  '_:c14n0 <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n' +
  '_:c14n0 <http://purl.org/dc/terms/creator> <did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1> .\n' +
  '_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#EcdsaKoblitzSignature2016> .\n' +
  `_:c14n0 <https://w3id.org/security#nonce> "1842fb5f" .\n` +
  '_:c14n0 <https://w3id.org/security#signatureValue> "bd881b1b8509e25a14153662ce521268d297e9fccfb32c514c9ab7ffefb329a0547ba6dc1731bde5a74b4799ef992eb791e71deda1015e6fe425fabe75b80bc3" .\n'
