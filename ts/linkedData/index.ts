import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { JsonLdObject, SignedJsonLdObject, JsonLdContext } from './types'
import { JoloDidMethod } from '../didMethods/jolo'
import { verifySignatureWithIdentity } from '../utils/validation'
import { Identity } from '../identity/identity'
import { IResolver } from '../didMethods/types'

/**
 * Helper function to handle JsonLD normalization.
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @internal
 * @param data - {@link JsonLdObject} without the '@context' section
 * @param context - JsonLD context to use during normalization
 */

export const normalizeJsonLd = async (
  { ['@context']: _, ...data }: JsonLdObject,
  context: JsonLdContext,
) =>
  canonize(data, {
    expandContext: context,
  })

/**
 * Helper function to handle JsonLD proof section normalization.
 * @dev The function expects the JsonLD '@context' to be passed as an argument
 * @internal
 * @param data - {@link ILinkedDataSignatureAttrs} Proof to be normalised
 * @param context - JsonLD context to use during normalization
 */

const normalizeLdProof = async (
  { signatureValue, id, type, ...toNormalize }: ILinkedDataSignatureAttrs,
  context: JsonLdContext,
): Promise<string> => normalizeJsonLd(toNormalize, context)

export const normalizeSignedLdObject = async (
  { proof, ['@context']: _, ...data }: SignedJsonLdObject,
  context: JsonLdContext,
): Promise<Buffer> =>
  Buffer.concat([
    sha256(Buffer.from(await normalizeLdProof(proof, context))),
    sha256(Buffer.from(await normalizeJsonLd(data, context))),
  ])

/**
 * Helper function to handle signed JsonLD digestions
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @internal
 * @param data - {@link SignedJsonLdObject}
 * @param context - JsonLD context to use during normalization
 */

export const digestJsonLd = async (
  signedLdObject: SignedJsonLdObject,
  context: JsonLdContext,
): Promise<Buffer> =>
  sha256(await normalizeSignedLdObject(signedLdObject, context))

/**
 * Helper function to handle JsonLD validation.
 * @param json - {@link SignedJsonLdObject} to be validated
 * @param resolverOrIdentity - a instance of an Identity, which can be used
 *   to find signing keys and verify the signature, or an instance of {@link Resolver} to use for retrieving the signer's keys.
 *   If nothing is provided, the default Jolocom resolver is used.
 */

export const validateJsonLd = async (
  json: SignedJsonLdObject,
  resolverOrIdentity: IResolver | Identity = new JoloDidMethod().resolver,
): Promise<boolean> => {
  const issuerIdentity =
    resolverOrIdentity instanceof Identity
      ? resolverOrIdentity
      : await resolverOrIdentity.resolve(keyIdToDid(json.proof.creator))

  return verifySignatureWithIdentity(
    await normalizeSignedLdObject(json, json['@context']),
    Buffer.from(json.proof.signatureValue, 'hex'),
    json.proof.creator,
    issuerIdentity,
  )
}
