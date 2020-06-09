import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { getIssuerPublicKey, keyIdToDid } from '../utils/helper'
import { IRegistry } from '../registries/types'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { JsonLdObject, SignedJsonLdObject, JsonLdContext } from './types'
import { JolocomRegistry } from '../registries/jolocomRegistry'
import { createResolver } from '../utils/validation'
import { DidDocument } from '../identity/didDocument/didDocument'

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

export const normalizeLdProof = async (
  { signatureValue, id, type, ...toNormalize }: ILinkedDataSignatureAttrs,
  context: JsonLdContext,
): Promise<string> => normalizeJsonLd(toNormalize, context)

/**
 * Helper function to handle signed JsonLD digestions
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @internal
 * @param data - {@link SignedJsonLdObject}
 * @param context - JsonLD context to use during normalization
 */

export const digestJsonLd = async (
  { proof, ['@context']: _, ...data }: SignedJsonLdObject,
  context: JsonLdContext,
): Promise<Buffer> =>
  sha256(
    Buffer.concat([
      sha256(Buffer.from(await normalizeLdProof(proof, context))),
      sha256(Buffer.from(await normalizeJsonLd(data, context))),
    ]),
  )

/**
 * Helper function to handle JsonLD validation.
 * @param json - {@link SignedJsonLdObject} to be validated
 * @param customRegistry - Custom registry implementation.
 *   If null, the {@link JolocomRegistry} is used
 */

export const validateJsonLd = async (
  json: SignedJsonLdObject,
  // TODO not any, rather resolver type
  customRegistry?: IRegistry | {[key: string] : any},
): Promise<boolean> => {
  const resolver = createResolver(customRegistry)
  // TODO This is an identity
  const issuerIdentity = await resolver.resolve(keyIdToDid(json.proof.creator))

  try {
    const issuerPublicKey = getIssuerPublicKey(
      json.proof.creator,
      //@ts-ignore TODO DidDocument vs IDidDocumentAttrs
      DidDocument.fromJSON(issuerIdentity)
    )

    return SoftwareKeyProvider.verify(
      await digestJsonLd(json, json['@context']),
      issuerPublicKey,
      Buffer.from(json.proof.signatureValue, 'hex'),
    )
  } catch {
    return false
  }
}
