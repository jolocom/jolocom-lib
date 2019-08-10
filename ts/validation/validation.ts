import { JolocomLib } from '../index'
import { IDigestible } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from '../utils/helper'
import { IRegistry } from '../registries/types'
import {JsonLdDigestible, SignedJsonLdObject} from './jsonLdValidator'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestible} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestible(signedCredential) // true`
 * @example `await validateDigestible(signedCredential, customRegistry) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestible = async (
  toValidate: IDigestible,
  customRegistry?: IRegistry,
): Promise<boolean> => {
  const reg = customRegistry || JolocomLib.registries.jolocom.create()
  const issuerIdentity = await reg.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      issuerIdentity.didDocument,
    )
    return await JolocomLib.KeyProvider.verifyDigestable(
      issuerPublicKey,
      toValidate,
    )
  } catch {
    return false
  }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}
 * @param toValidate - Array of objects implementing the {@link IDigestible} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestible(signedCredentials) // [true, false...]`
 * @example `await validateDigestible(signedCredentials, customRegistry) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestibles = async (
  toValidate: IDigestible[],
  customRegistry?: IRegistry,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestible(digestable, customRegistry),
    ),
  )

export const validateJsonLd = async (
  json: SignedJsonLdObject,
  customRegistry?: IRegistry,
): Promise<boolean> =>
  validateDigestible(new JsonLdDigestible(json), customRegistry)
