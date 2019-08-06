import {
  ILinkedDataSignatureAttrs,
  IDigestible,
} from '../linkedDataSignature/types'
import { EcdsaLinkedDataSignature } from '../linkedDataSignature'
import { ISigner } from '../registries/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'
import { defaultContext } from '../utils/contexts'
import {normalizeLdProof} from '../linkedDataSignature/suites/ecdsaKoblitzSignature2016'

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export interface JsonLdObject {
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}

export interface SignedJsonLdObject extends JsonLdObject {
  proof: ILinkedDataSignatureAttrs
}

export class JsonLdDigestible implements IDigestible {
  public readonly data: JsonLdObject
  private readonly proof: ILinkedDataSignatureAttrs
  private readonly _signatureCreator: string
  private readonly _signature: string

  public constructor({ proof, ...data }: SignedJsonLdObject) {
    const { creator, signature } = EcdsaLinkedDataSignature.fromJSON(proof)

    this.data = data
    this.proof = proof
    this._signatureCreator = creator
    this._signature = signature
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

  public async digestDataSection(): Promise<Buffer> {
    return sha256(Buffer.from(await this.normalize(this.data)))
  }


  private async digestProofSection(): Promise<Buffer> {
    return sha256(Buffer.from(await normalizeLdProof(this.proof)))
  }

  public async digest(): Promise<Buffer> {
    const dataSectionDigest = await this.digestDataSection()
    const proofSectionDigest = await this.digestProofSection()

    return sha256(Buffer.concat([proofSectionDigest, dataSectionDigest]))
  }

  public normalize = normalizeJsonLD
}

export const normalizeJsonLD = async (
  data: JsonLdObject,
  context = defaultContext,
) => {

  return canonize(data, {
    expandContext: context
  })
}
