/**
 * Helper function to convert a key identifier to the owner did
 * @param keyId - public key identifier
 * @example `keyIdToDid('did:jolo:abc...fe#keys-1') // 'did:jolo:abc...fe'`
 * @internal
 */

export function keyIdToDid(keyId: string): string {
  return keyId.substring(0, keyId.indexOf('#'))
}