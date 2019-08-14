import {
  ILinkedDataSignatureAttrs,
  IDigestible,
} from '../linkedDataSignature/types'
import { EcdsaLinkedDataSignature } from '../linkedDataSignature'
import { ISigner } from '../registries/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { ContextTransformer, JsonLdContext } from '../utils/contexts/types'
import { cachedContextTransformer } from '../utils/contexts/contextTransformers'

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export interface JsonLdObject {
  '@context'?: JsonLdContext
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}

export interface SignedJsonLdObject extends JsonLdObject {
  '@context': JsonLdContext
  proof: ILinkedDataSignatureAttrs
}

/**
 * Helper class, implementing the {@link IDigestible} interface,
 *  which can be instantiated from a JsonLD Document satisfying the {@link SignedJsonLdObject} interface.
 */

export class JsonLdDigestible implements IDigestible {
  public readonly data: JsonLdObject
  private readonly proof: ILinkedDataSignatureAttrs
  private readonly context: JsonLdContext
  private readonly _signatureCreator: string
  private readonly _signature: string

  public constructor({ proof, ...data }: SignedJsonLdObject) {
    const { creator, signature } = EcdsaLinkedDataSignature.fromJSON(proof)
    this.data = data
    this.proof = proof
    this._signatureCreator = creator
    this._signature = signature
    this.context = data['@context']
  }

  public get signer(): ISigner {
    return {
      did: keyIdToDid(this._signatureCreator),
      keyId: this._signatureCreator,
    }
  }

  public get signature(): string {
    return this._signature
  }

  /**
   * Returns the sha256 hash of the normalized linked data signature,
   *  per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   */

  private async digestDataSection(): Promise<Buffer> {
    return sha256(Buffer.from(await this.normalize(this.data, this.context)))
  }

  /**
   * Returns the sha256 hash of the normalized data section of the JsonLD Document,
   *  per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   */

  private async digestProofSection(): Promise<Buffer> {
    return sha256(Buffer.from(await normalizeLdProof(this.proof, this.context)))
  }

  /**
   * Returns the sha256 hash of the concatenated signature / data digests,
   *  per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   */

  public async digest(): Promise<Buffer> {
    const dataSectionDigest = await this.digestDataSection()
    const proofSectionDigest = await this.digestProofSection()

    return sha256(Buffer.concat([proofSectionDigest, dataSectionDigest]))
  }

  public normalize = normalizeJsonLD
}

/**
 * Helper function to handle JsonLD normalization.
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @param data - {@link JsonLdObject} without the '@context' section
 * @param contextTransformer - {@link ContextTransformer} function for custom context
 *  modifications before it's used for normalization
 * @param context - JsonLD context to use during normalization
 */

export const normalizeJsonLD = async (
  { ['@context']: _, ...data }: JsonLdObject,
  context: JsonLdContext,
  contextTransformer: ContextTransformer = cachedContextTransformer,
) => {
  return canonize(data, {
    expandContext: contextTransformer(context),
  })
}

export const normalizeLdProof = (
  { ['@context']: _, ...proof }: ILinkedDataSignatureAttrs,
  context: JsonLdContext,
  contextTransformer: ContextTransformer = cachedContextTransformer,
): Promise<string> => {
  const { signatureValue, id, type, ...toNormalize } = proof
  return normalizeJsonLD(toNormalize, context, contextTransformer)
}
