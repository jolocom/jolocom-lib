import { DidDocument } from '../identity/didDocument/didDocument'
import { pubToAddress, addHexPrefix } from 'ethereumjs-util'
import fetch from 'node-fetch'

/**
 * Helper function to convert a key identifier to the owner did
 * @param keyId - public key identifier
 * @example `keyIdToDid('did:jolo:abc...fe#keys-1') // 'did:jolo:abc...fe'`
 * @internal
 */

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
}

export function getIssuerPublicKey(keyId: string, ddo: DidDocument): Buffer {
  const relevantKeySection = ddo.publicKey.find(section => section.id === keyId)

  if (!relevantKeySection) {
    throw new Error('No relevant key-id found')
  }

  return Buffer.from(relevantKeySection.publicKeyHex, 'hex')
}

export function handleValidationStatus(success: boolean, key: string) {
  if (!success) {
    throw new Error(ErrorKeys[key] || 'Unknown Error key')
  }
}

const ErrorKeys = {
  exp: 'Token expired',
  sig: 'Signature on token is invalid',
  nonce: 'The token nonce deviates from request',
  aud: 'You are not the intended audience of received token'
}

/**
 * Helper function to transfer 0.1 Ether to an address given the corresponding public key
 * The Ether is used for anchoring the identity.
 * @param publicKey - public key the Ether should be transferred to
 * @example `await fuelKeyWithEther(Buffer.from('03848...', 'hex'))`
 */

export function fuelKeyWithEther(publicKey: Buffer) {
  return fetch('https://faucet.jolocom.com/request/', {
    method: 'POST',
    body: JSON.stringify({ address: publicKeyToAddress(publicKey) }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * Helper function to derive the Ethereum address given a public key
 * @param publicKey - public key we want the address for
 * @example `publicKeyToAddress(Buffer.from('03848...', 'hex')) // '0x3e2e5e7c72ff8b25d423c184df0056ca1f7bb7a4'
 * @internal
 */

export const publicKeyToAddress = (publicKey: Buffer): string => addHexPrefix(pubToAddress(publicKey, true).toString('hex'))
