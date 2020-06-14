import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { DidDocument } from '../identity/didDocument/didDocument'
import { convertDidDocToIDidDocumentAttrs } from './resolution'
import { jolocomResolver } from '../registries/jolocomRegistry'

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
  resolver = jolocomResolver(),
): Promise<boolean> => {
  const issuerIdentity = await resolver.resolve(toValidate.signer.did)
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
   * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. If none is provided, the default Jolocom contract is used for resolution.
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, jolocomResolver()) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestables = async (
  toValidate: IDigestable[],
  resolver = jolocomResolver(),
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, resolver),
    ),
  )

