import Did from './did'

export default interface AuthenticationCredential {
  id: Did
  authType: string[]
  owner: Did
  curve: string
  publicKeyBase64: string
}

export function ecdsaAuthenticationCredentials(publicKey: string, did: Did): any {
  let credential = {
    id: did,
    authType: ["CryptographicKey", "EcDsaSAKey"],
    owner: did,
    curve: 'secp256k1',
    publicKeyBase64: publicKey
  } as AuthenticationCredential
  return credential
}
