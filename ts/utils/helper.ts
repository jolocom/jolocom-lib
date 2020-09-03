import { pubToAddress, addHexPrefix } from 'ethereumjs-util'
import fetch from 'node-fetch'
import { KeyTypes, PublicKeyInfo } from '@jolocom/vaulted-key-provider'
import { IKeyMetadata } from '../identityWallet/types'
import { ErrorCodes } from '../errors'
import { DidDocument } from '../identity/didDocument/didDocument'

/**
 * Helper function to convert a key identifier to the owner did
 * @param keyId - public key identifier
 * @example `keyIdToDid('did:jolo:abc...fe#keys-1') // 'did:jolo:abc...fe'`
 * @internal
 */

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
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
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Helper function to derive the Ethereum address given a public key
 * @param publicKey - public key we want the address for
 * @example `publicKeyToAddress(Buffer.from('03848...', 'hex')) // '0x3e2e5e7c72ff8b25d423c184df0056ca1f7bb7a4'
 * @internal
 */

export const publicKeyToAddress = (publicKey: Buffer): string =>
  addHexPrefix(pubToAddress(publicKey, true).toString('hex'))

/**
 * Helper function to map DID Document key references to vkp key URNs
 * @param identity - The DID Document from this identity will be used as a source of keys to map
 * @param vkpKeys - Keys to map to the entries in the did doc (notmrally the result of calling vkp.getPubKeys(pass))
 * @returns - A map with generic key roles (e.g. signing, encryption), assembled from combing references from the DID Document
 * with keys from the vkp
 */

export const mapPublicKeys = (
  didDocument: DidDocument,
  vkpKeys: PublicKeyInfo[],
): IKeyMetadata => {
  const { keyId, did } = didDocument.signer

  const signingKeyRef = keyId.includes('did:') ? keyId : `${did}${keyId}`

  const sigKey = vkpKeys.find(k => k.controller.find(c => c === signingKeyRef))
  const encKey = didDocument.publicKey.find(
    k => k.type === KeyTypes.x25519KeyAgreementKey2019,
  )


  const encKeyRef =
    encKey &&
    (encKey.id.startsWith('did:')
      ? encKey.id
      : `${encKey.controller}${encKey.id}`)


  if (!sigKey) {
    throw new Error(ErrorCodes.PublicKeyNotFound)
  }

  return {
    signingKey: {
      keyId: sigKey.controller[0],
      type: sigKey.type
    },
    encryptionKey: {
      keyId: encKeyRef,
      // @ts-ignore TODO Convert type
      type: encKeyRef && encKey.type
    },
  }
}
