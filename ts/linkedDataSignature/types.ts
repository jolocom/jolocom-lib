export interface ILinkedDataSignature {
  getCreator: () => string
  getNonce: () => string
  getCreationDate: () => Date
  setCreator: (creator: string) => void
  setNonce: (nonce: string) => void
  setSignatureValue: (signatureValue: Buffer) => void
  setCreationDate: (creation: Date) => void
  toJSON: () => ILinkedDataSignatureAttrs
  fromJSON: (json: ILinkedDataSignatureAttrs) => ILinkedDataSignature
}

export interface IDigestable {
  getSignatureValue: () => Buffer
  digest: () => Promise<Buffer>
}

export interface ILinkedDataSignatureAttrs {
  type: string
  created: string
  creator: string
  nonce: string
  signatureValue: string
}