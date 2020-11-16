export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'

export interface IIDigestable {
  asBytes: () => Promise<Buffer>
  digest: () => Promise<Buffer>
  signer: {
    keyId: string
    did: string
  }
}
