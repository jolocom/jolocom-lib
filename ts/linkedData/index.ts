import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { JsonLdObject, SignedJsonLdObject, JsonLdContext } from './types'
import { JoloDidMethod } from '../didMethods/jolo'
import { verifySignature } from '../utils/validation'
import { verify as eccVerify } from 'tiny-secp256k1'

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
 * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. 
 * If none is provided, the default Jolocom contract is used for resolution.
 */

export const validateJsonLd = async (
  json: SignedJsonLdObject,
  resolver = new JoloDidMethod().resolver
): Promise<boolean> => {
  const issuerIdentity = await resolver.resolve(keyIdToDid(json.proof.creator))
  try {
    const {
      publicKeyHex,
      type,
      id
    } = issuerIdentity.didDocument.findPublicKeySectionById(json.proof.creator)


    const digest = sha256(await normalizeSignedLdObject(json, json['@context']))

    console.log(await eccVerify(
      digest,
      Buffer.from(publicKeyHex, 'hex'),
      Buffer.from(json.proof.signatureValue, 'hex')
    ))

    console.log(
      {
        //@ts-ignore TODO
        type,
        publicKey: Buffer.from(publicKeyHex, 'hex')
      }
    )

    return verifySignature(
      await normalizeSignedLdObject(json, json['@context']),
      Buffer.from(json.proof.signatureValue, 'hex'),
      {
        //@ts-ignore TODO
        type,
        publicKey: Buffer.from(publicKeyHex, 'hex'),
        controller: [id],
        id: '1'
      }
    )
  } catch(e) {
    return false
  }
}
