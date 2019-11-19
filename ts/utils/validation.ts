import { JolocomLib } from '../index'
import { IDigestable, ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { IRegistry } from '../registries/types'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'

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
  customRegistry?: IRegistry,
): Promise<boolean> => {
  const reg = customRegistry || JolocomLib.registries.jolocom.create()
  const issuerIdentity = await reg.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      issuerIdentity.didDocument,
    )
    return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, toValidate)
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
  customRegistry?: IRegistry,
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, customRegistry),
    ),
  )


/**
 * Helper function to handle JsonLD normalization.
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @param data - {@link JsonLdObject} without the '@context' section
 * @param contextTransformer - {@link ContextTransformer} function for custom context
 *  modifications before it's used for normalization
 * @param context - JsonLD context to use during normalization
 */


const normalizeJsonLD = async ({ ['@context']: _, ...data }, context) => {
  return canonize(data, {
    expandContext: context,
  })
}

const normalizeLdProof = async (
  //@ts-ignore
  proof: ILinkedDataSignatureAttrs,
  context,
): Promise<string> => {
  const { signatureValue, id, type, ...toNormalize } = proof
  //@ts-ignore
  return normalizeJsonLD(toNormalize, context)
}

export const digestJsonLd = async (
    {proof, ...data},
): Promise<Buffer> => sha256(Buffer.concat([
    sha256(Buffer.from(await normalizeLdProof(proof, data['@context']))),
    //@ts-ignore
    sha256(Buffer.from(await normalizeJsonLD(data, data['@context'])))
]))
