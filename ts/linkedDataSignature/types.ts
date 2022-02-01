import { JsonLdObject } from '@jolocom/protocol-ts'
import { BaseProofOptions, LinkedDataProof } from '.'

export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'

export interface IIDigestable {
  asBytes: () => Promise<Buffer>
  digest: () => Promise<Buffer>
  signer: {
    keyId: string
    did: string
  }
}

export type ProofOptions = {
    verificationMethod: string,
    proofPurpose?: string,
    created?: Date,
}

export type ProofDerivationOptions = {
  document: JsonLdObject,
  previousProofs?: Array<LinkedDataProof<BaseProofOptions>>,
}