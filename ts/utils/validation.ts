import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { DidDocument } from '../identity/didDocument/didDocument'
import { createResolver, convertDidDocToIDidDocumentAttrs } from './resolution'
import { Resolver } from 'did-resolver'
import { getResolver } from 'jolo-did-resolver/js'
import { jolocomResolver } from '../registries/jolocomRegistry'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, customRegistry) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestable = async (
  toValidate: IDigestable,
  customResolver = jolocomResolver(),
): Promise<boolean> => {
  const issuerIdentity = await customResolver.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      // TODO Use the right type internally
      DidDocument.fromJSON(convertDidDocToIDidDocumentAttrs(issuerIdentity))
    )
    return SoftwareKeyProvider.verifyDigestable(issuerPublicKey, toValidate)
  } catch {
    return false
  }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, customRegistry) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestables = async (
  toValidate: IDigestable[],
  customResolver = jolocomResolver(),
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, customResolver),
    ),
  )

