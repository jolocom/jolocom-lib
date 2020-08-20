import { pubToAddress, addHexPrefix } from 'ethereumjs-util'
import fetch from 'node-fetch'
import { Identity } from '../identity/identity'
import { IVaultedKeyProvider, KeyTypes, PublicKeyInfo } from '@jolocom/vaulted-key-provider'
import { IKeyMetadata } from '../identityWallet/types'
import { ErrorCodes } from '../errors'

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
 * @param identity - Identity to map keys to
 * @param vkp - store of key material to be mapped
 * @param pass - password for vaulted key provider
 * TODO This should take vkp keys instead of vkp + pass
 */
export const mapPublicKeys = async (
  identity: Identity,
  vkpKeys: PublicKeyInfo[],
): Promise<IKeyMetadata> => {
  const signingKeyRef = `${identity.didDocument.signer.did}${identity.didDocument.signer.keyId}`

  const sigKey = vkpKeys.some(k => k.controller.find(c => c === signingKeyRef))

  const encKey = vkpKeys.find(
    k => k.type === KeyTypes.x25519KeyAgreementKey2019,
  )

  if (!sigKey) {
    throw new Error(ErrorCodes.PublicKeyNotFound)
  }

  return {
    signingKeyId: signingKeyRef,
    encryptionKeyId: encKey.controller[0],
  }
}
