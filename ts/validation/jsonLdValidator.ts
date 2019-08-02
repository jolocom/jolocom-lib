import {
  ILinkedDataSignatureAttrs,
  IDigestible,
} from '../linkedDataSignature/types'
import { EcdsaLinkedDataSignature } from '../linkedDataSignature'
import { ISigner } from '../registries/types'
import { keyIdToDid } from '../utils/helper'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'

export interface SignedJsonLd {
  proof: ILinkedDataSignatureAttrs
}

export class JsonLdDigestible implements IDigestible {
  public data: SignedJsonLd
  private proof: EcdsaLinkedDataSignature

  public constructor(data: SignedJsonLd) {
    this.data = data
    this.proof = EcdsaLinkedDataSignature.fromJSON(data.proof)
  }

  public get signer(): ISigner {
    return {
      did: keyIdToDid(this.proof.creator),
      keyId: this.proof.creator,
    }
  }

  public get signature(): string {
    return this.proof.signature
  }

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()

    const docSectionDigest = sha256(Buffer.from(normalized))
    const proofSectionDigest = await this.proof.digest()

    return sha256(Buffer.concat([proofSectionDigest, docSectionDigest]))
  }

  public async normalize(): Promise<string> {
    const json = Object.assign({}, this.data)
    delete json.proof
    return canonize(json)
  }
}
