import {
  ILinkedDataSignatureAttrs,
  IDigestible,
} from '../linkedDataSignature/types'
import { EcdsaLinkedDataSignature } from '../linkedDataSignature'
import { ISigner } from '../registries/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { normalizeLdProof } from '../linkedDataSignature/suites/ecdsaKoblitzSignature2016'

export interface JsonLdObject {
  '@context'?: JsonLdContext
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}
export type JsonLdContext = string | JsonLdObject | Array<string | JsonLdObject>

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export interface SignedJsonLdObject extends JsonLdObject {
  '@context': JsonLdContext
  proof: ILinkedDataSignatureAttrs
}

export class JsonLdDigestible implements IDigestible {
  public readonly data: JsonLdObject
  private readonly proof: ILinkedDataSignatureAttrs
  private readonly context: JsonLdContext | JsonLdContext[]
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
   * Returns the sha256 hash of the linked data signature, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   */

  private async digestDataSection(): Promise<Buffer> {
    return sha256(Buffer.from(await this.normalize(this.data, this.context)))
  }

  private async digestProofSection(): Promise<Buffer> {
    return sha256(Buffer.from(await normalizeLdProof(this.proof, this.context)))
  }

  public async digest(): Promise<Buffer> {
    const dataSectionDigest = await this.digestDataSection()
    const proofSectionDigest = await this.digestProofSection()

    return sha256(Buffer.concat([proofSectionDigest, dataSectionDigest]))
  }

  public normalize = normalizeJsonLD
}

export const normalizeJsonLD = async (
  { ['@context']: _, ...data }: JsonLdObject,
  context: JsonLdContext | JsonLdContext[],
) => {
  return canonize(data, {
    expandContext: context,
  })
}
