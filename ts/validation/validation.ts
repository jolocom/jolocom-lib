import { JolocomLib } from '../index'
import { IDigestible } from '../linkedDataSignature/types'
import { IRegistry } from '../registries/types'
import { JsonLdDigestible, SignedJsonLdObject } from './jsonLdValidator'
import { IDigestable } from '../linkedDataSignature/types'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { MultiResolver } from '../resolver'
import { DidDocument } from '../identity/didDocument/didDocument'
import {getIssuerPublicKey} from '../utils/helper'
import {multiResolver} from '../../js/resolver'

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
  const issuerIdentityJson = await resolver.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      DidDocument.fromJSON(issuerIdentityJson),
    )
    return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, toValidate)
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
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
 * @param resolver - optional custom resolver used to fetch signer public keys
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, customResolver) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
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
  customRegistry?: IRegistry,
): Promise<boolean> =>
  validateDigestible(new JsonLdDigestible(json), customRegistry)

/** @TODO replace the validation function once the JSON validation function is added */
export const noValidation = async (didDocument: IDidDocumentAttrs) => {
  return !!didDocument
}
