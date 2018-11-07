import { DidDocument } from "../identity/didDocument/didDocument"

// Helper function for data preparation

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
}

export function getIssuerPublicKey(keyId: string, ddo: DidDocument): Buffer {
  const relevantPubKey = ddo.getPublicKeySections().map((keySection) => {
    if (keySection.getIdentifier() === keyId) { return keySection.getPublicKeyHex() }
  })

  return Buffer.from(relevantPubKey[0], 'hex')
}

export function handleValidationStatus(status: boolean, key: string) {
  switch (status) {
    case false:
      throw new Error(ErrorKeys[key] || 'Unknown Error key') 
    default:
      return
  }
}

export enum ErrorKeys {
  exp = 'Token expired',
  sig = 'Signature on token is invalid',
  nonce = 'The token nonce deviates from request',
  aud = 'You are not the intended audience of received token'
}