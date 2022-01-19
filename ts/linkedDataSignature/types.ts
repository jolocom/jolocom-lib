import { ILinkedDataSignature, JsonLdObject } from '@jolocom/protocol-ts'

export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'

export interface IIDigestable {
  asBytes: () => Promise<Buffer>
  digest: () => Promise<Buffer>
  signer: {
    keyId: string
    did: string
  }
}

export type ProofDerivationOptions = {
  document: JsonLdObject,
  previousProofs?: ILinkedDataSignature[],
  proofOptions: {
    verificationMethod: string,
    proofPurpose?: string,
    created: Date
  }
}