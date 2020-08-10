import { IDigestable } from '../linkedDataSignature/types'
import { JoloDidMethod } from '../didMethods/jolo'
import { KeyTypes, getCryptoProvider, PublicKeyInfo } from '@jolocom/vaulted-key-provider'
import { cryptoUtils } from '@jolocom/native-utils-node'
/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
   * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. If none is provided, the default Jolocom contract is used for resolution.
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, jolocomResolver()) // true`
 * @returns {boolean} - True if signature is valid, false otherwise */

interface PubKeyForVerification {
  publicKey: Buffer,
  type: KeyTypes
}

/**
 * TODO Document
 * Given a buffer (the message, not hashed), a signature, and a pKey object, will attempt to
 * verify the signature (the algs are chosen based on pKey.type)
 */

// TODO The api on cryptoProvider.verify should only need a pub key and a key type
export const verifySignature = (
  data: Buffer,
  signature: Buffer,
  pKey: PublicKeyInfo,
): Promise<boolean> => {
  const compatibilityMap = {
    'Secp256k1VerificationKey2018': 'EcdsaSecp256k1VerificationKey2019'
  }

  return getCryptoProvider(cryptoUtils).verify(
    Buffer.from(pKey.publicKeyHex, 'hex'),
    compatibilityMap[pKey.type] || pKey.type,
    data,
    signature,
  )
}

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
   * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. If none is provided, the default Jolocom contract is used for resolution.
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, jolocomResolver()) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestable = async (
  toValidate: IDigestable,
  resolver = new JoloDidMethod().resolver,
): Promise<boolean> => {
  const issuerIdentity = await resolver.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = issuerIdentity.didDocument.findPublicKeySectionById(
      toValidate.signer.keyId,
    )

    // TODO Correctly extract / asign the KeyType
    return verifySignature(
      await toValidate.asBytes(),
      Buffer.from(toValidate.signature, 'hex'),
      {
        type: issuerPublicKey.type as KeyTypes,
        publicKeyHex: issuerPublicKey.publicKeyHex,
        controller: [ issuerPublicKey.id ],
        id: 'yo'
      }
    )
  } catch(e) {
    console.log('caught', e)
    return false
  }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
   * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. If none is provided, the default Jolocom contract is used for resolution.
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, jolocomResolver()) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestables = async (
  toValidate: IDigestable[],
  resolver = new JoloDidMethod().resolver,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, resolver),
    ),
  )
