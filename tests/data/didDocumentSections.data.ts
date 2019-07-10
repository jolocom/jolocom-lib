import { testPublicKey } from './keys.data'
import { mockDid, mockKeyId, mockPublicKeyHex } from './didDocument.data'
import { publicProfileCredJSON } from './identity.data'
import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/js/types'

export const mockPubKeySectionCreationAttrs = {
  publicKey: testPublicKey,
  did: mockDid,
  keyId: mockKeyId,
}

export const mockPubKeySectionJSON = {
  id: mockKeyId,
  type: 'Secp256k1VerificationKey2018',
  owner: mockDid,
  publicKeyHex: mockPublicKeyHex,
}

export const mockAuthSectionJSON = {
  publicKey: mockKeyId,
  type: 'Secp256k1SignatureAuthentication2018',
}

export const mockPubProfServiceEndpointJSON = {
  id: `${mockDid};jolocomPubProfile`,
  serviceEndpoint: publicProfileCredJSON as PublicProfileClaimMetadata,
  description: 'Verifiable Credential describing entity profile',
  type: 'JolocomPublicProfile',
}

export const mockServiceEndpointJSON = {
  id: `${mockDid};service`,
  serviceEndpoint: 'https://some-endpoint.io',
  description: 'Endpoint Description',
  type: 'Endpoint',
}
