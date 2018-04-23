export interface ILinkedDataSignature {
  type: string
  created: Date
  creator: string
  nonce: string
  signatureValue: string
  digest: () => Promise<string>
  getSigValue: () => Buffer
}
