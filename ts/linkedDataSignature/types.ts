export interface ILinkedDataSignature {
  type: string
  created: Date
  creator: string
  nonce: string
  signatureValue: string
  digest: () => Promise<string>
  getSigValue: () => Buffer
  getProofSectionType: () => string
  toJSON: () => ILinkedDataSignature
  fromJSON: (json: ILinkedDataSignature) => ILinkedDataSignature
}

export enum proofTypes {
  proofSet = 'proofSet',
  proofChain = 'proofChain'
}
