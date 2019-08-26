import { JolocomLib } from '../index'
import { IDigestible} from '../linkedDataSignature/types'
import {multiResolver, MultiResolver } from '../resolver'
import {getIssuerPublicKey} from '../utils/helper'
import {JsonLdDigestible, SignedJsonLdObject} from './jsonLdValidator'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestible} interface
 * @param resolver - optional custom resolver used to fetch signer public keys
 * @example `await validateDigestible(signedCredential) // true`
 * @example `await validateDigestible(signedCredential, customRegistry) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestible = async (
  toValidate: IDigestible,
  resolver: MultiResolver = multiResolver,
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
 * @param toValidate - Array of objects implementing the {@link IDigestible} interface
 * @param resolver - optional custom resolver used to fetch signer public keys
 * @example `await validateDigestible(signedCredentials) // [true, false...]`
 * @example `await validateDigestible(signedCredentials, customRegistry) // [true, false...]`
 */

export const validateDigestibles = async (
  toValidate: IDigestible[],
  resolver: MultiResolver = multiResolver,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestible(digestable, resolver),
    ),
  )

export const validateJsonLd = async (
  json: SignedJsonLdObject,
  resolver: MultiResolver = multiResolver,
): Promise<boolean> =>
  validateDigestible(new JsonLdDigestible(json), resolver)

/** @TODO replace the validation function once the JSON validation function is added */
export const noValidation = async <T>(toValidate: T) => {
  return !!toValidate
}
