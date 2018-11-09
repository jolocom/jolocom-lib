import { DidDocument } from "../identity/didDocument/didDocument"

// Helper function for data preparation

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
}

export function getIssuerPublicKey(keyId: string, ddo: DidDocument): Buffer {
  const relevantKeySection = ddo.getPublicKeySections()
    .find(section => section.getIdentifier() === keyId)

  if (!relevantKeySection) {
    throw new Error('No relevant key-id found')
  }

  return Buffer.from(relevantKeySection.getPublicKeyHex(), 'hex')
}

export function handleValidationStatus(success: boolean, key: string) {
  if(!success) {
    throw new Error(ErrorKeys[key] || 'Unknown Error key') 
  }
}

const ErrorKeys = {
  exp: 'Token expired',
  sig: 'Signature on token is invalid',
  nonce: 'The token nonce deviates from request',
  aud: 'You are not the intended audience of received token'
}