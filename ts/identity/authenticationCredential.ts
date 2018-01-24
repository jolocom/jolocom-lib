import Did from './did'

export default interface AuthenticationCredential {
  id: Did
  'type': string[]
  owner: Did
  curve: string
  publicKeyBase64: string
}

export function ecdsaAuthenticationCredentials(publicKey: string, did: Did): any {
  let credential = {
    id: generateGenericKeyId(did),
    'type': ["CryptographicKey", "EcDsaSAKey"],
    owner: did,
    curve: 'secp256k1',
    publicKeyBase64: publicKey
  } as AuthenticationCredential
  return credential
}

export function generateGenericKeyId(did: Did): Did {
  return Did.fromJson(did.toJSON() + '#keys/generic/1')
}
