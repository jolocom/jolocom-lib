import { JolocomLib } from '../index'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { MultiResolver, mutliResolver } from '../resolver'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
 * @param resolver - optional custom resolver used to fetch signer public keys
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, customResolver) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestable = async (
  toValidate: IDigestable,
  resolver: MultiResolver = mutliResolver,
): Promise<boolean> => {
  const issuerIdentity = await resolver.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      issuerIdentity.didDocument
    )
    return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, toValidate)
  } catch {
    return false
  }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
 * @param resolver - optional custom resolver used to fetch signer public keys
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, customResolver) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestables = async (
  toValidate: IDigestable[],
  resolver: MultiResolver = mutliResolver,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, resolver),
    ),
  )

/** @TODO replace the validation function once the JSON validation function is added */
export const noValidation = async <T>(toValidate: T) => {
  return !!toValidate
}
