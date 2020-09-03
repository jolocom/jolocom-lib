import { IDigestable } from '../linkedDataSignature/types'
import { JoloDidMethod } from '../didMethods/jolo'
import { KeyTypes, getCryptoProvider } from '@jolocom/vaulted-key-provider'
import { cryptoUtils } from '@jolocom/native-core'
import { Identity } from '../identity/identity'
import { IResolver } from '../didMethods/types'
import { parseHexOrBase64 } from './crypto'

export type IdentityOrResolver = Identity | IResolver

/**
 * TODO Document
 * Given a buffer (the message, not hashed), a signature, and a pKey object, will attempt to
 * verify the signature (the algs are chosen based on pKey.type)
 */

const verifySignature = (
  data: Buffer,
  signature: Buffer,
  pKey: Buffer,
  keyType: KeyTypes,
): Promise<boolean> => {
  const compatibilityMap = {
    Secp256k1VerificationKey2018: 'EcdsaSecp256k1VerificationKey2019',
  }

  return getCryptoProvider(cryptoUtils).verify(
    pKey,
    compatibilityMap[keyType] || keyType,
    data,
    signature,
  )
}

export const verifySignatureWithIdentity = async (
  data: Buffer,
  signature: Buffer,
  signingKeyId: string,
  signer: Identity,
) => {
  const signingKey = signer.didDocument.findPublicKeySectionById(signingKeyId)

  if (!signingKey) {
    console.warn(
      `Signing key with id ${signingKeyId} not found in signer's DID Document`,
    )
    return false
  }

  return verifySignature(
    data,
    signature,
    signingKey.publicKeyHex
      ? Buffer.from(signingKey.publicKeyHex, 'hex')
       //@ts-ignore TODO Keri DID Docs and Jolo DID Docs encode the key differently
      : Buffer.from(signingKey.publicKeyBase64, 'base64'),
    signingKey.type as KeyTypes,
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
  resolverOrIdentity: IdentityOrResolver = new JoloDidMethod().resolver,
): Promise<boolean> => {
  const issuerIdentity =
    resolverOrIdentity instanceof Identity
      ? resolverOrIdentity
      : await resolverOrIdentity.resolve(toValidate.signer.did)

  return verifySignatureWithIdentity(
    await toValidate.asBytes(),
    parseHexOrBase64(toValidate.signature),
    toValidate.signer.keyId,
    issuerIdentity,
  )
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
  resolverOrIdentity: IdentityOrResolver = new JoloDidMethod().resolver,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, resolverOrIdentity),
    ),
  )
