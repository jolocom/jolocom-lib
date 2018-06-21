export interface ILinkedDataSignature {
  digest: () => Promise<string>
  getSigValue: () => Buffer
  getProofSectionType: () => string
  toJSON: () => ILinkedDataSignatureAttrs
  fromJSON: (json: ILinkedDataSignatureAttrs) => ILinkedDataSignature
}

export interface ILinkedDataSignatureAttrs {
  type: string
  created: string
  creator: string
  nonce: string
  signatureValue: string
}

export enum proofTypes {
  proofSet = 'proofSet',
  proofChain = 'proofChain'
}
