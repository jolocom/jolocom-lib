export * from '@jolocom/protocol-ts/dist/lib/signedCredential'

// TODO Move or remove?
export interface ISigner {
  did: string
  keyId: string
}
