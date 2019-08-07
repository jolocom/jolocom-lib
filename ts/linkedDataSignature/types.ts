export interface ISerializable {
  toJSON: () => {}
}

export interface ILinkedDataSignature extends IDigestible, ISerializable {
  creator: string
  type: string
  nonce: string
  created: Date
}

export interface IDigestible {
  signature: string
  digest: () => Promise<Buffer>
  signer: {
    did: string
    keyId: string
  }
}

export interface ILinkedDataSignatureAttrs {
  type: string
  created: string
  creator: string
  nonce: string
  signatureValue: string
  id?: string
}
