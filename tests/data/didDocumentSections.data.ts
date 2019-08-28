import { testPublicIdentityKey } from './keys.data'
import {
  mockDid,
  mockKeyId,
  mockKeyId2,
  mockKeyId3,
  mockPublicKeyHex,
  mockPublicKeyEth,
  mockIpfsHash,
} from './didDocument.data'

export const mockPubKeySectionCreationAttrs = {
  publicKey: testPublicIdentityKey,
  did: mockDid,
  keyId: mockKeyId,
}

export const mockPubKeySectionCreationAttrs2= {
  publicKey: mockPublicKeyEth,
  did: mockDid,
  keyId: mockKeyId3,
}

export const mockPublicKey = {
  id: mockKeyId,
  type: 'Secp256k1VerificationKey2018',
  controller: mockDid,
  publicKeyHex: mockPublicKeyHex,
}
export const mockPublicKey2 = {
  id: mockKeyId2,
  type: 'Secp256k1VerificationKey2018',
  controller: mockDid,
  publicKeyHex: mockPublicKeyHex,
}

export const mockPublicKey3 = {
    id: mockKeyId3,
    type: 'Secp256k1VerificationKey2018',
    controller: mockDid,
    ethereumAddress: mockPublicKeyEth
}

export const mockPubProfServiceEndpointJSON = {
  id: `${mockDid}#jolocomPubProfile`,
  serviceEndpoint: `ipfs://${mockIpfsHash}`,
  description: 'Verifiable Credential describing entity profile',
  type: 'JolocomPublicProfile',
}
