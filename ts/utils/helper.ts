// Helper function for data preparation

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
}