export interface ISerializable {
  toJSON: () => {}
}

export interface ILinkedDataSignature extends IDigestable, ISerializable {
  creator: string
  type: string
  nonce: string
  created: Date
  signatureValue: string
}
export interface IDigestable {
  signatureValue: string
  digest: () => Promise<Buffer>
}

export interface ILinkedDataSignatureAttrs {
  type: string
  created: string
  creator: string
  nonce: string
  signatureValue: string
}
