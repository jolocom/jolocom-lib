import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { ISignedCredRequestPayload, IJWTHeader } from '../credentialRequest/signedCredentialRequest/types'
import { ISignedCredResponsePayload } from '../credentialResponse/signedCredentialResponse/types'
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { SignedCredentialResponse } from '../credentialResponse/signedCredentialResponse/signedCredentialResponse'
import { JolocomRegistry } from '../registries/jolocomRegistry'

export type jwtPayload = ISignedCredRequestPayload | ISignedCredResponsePayload
export type jwtEnabledClass = SignedCredentialRequest | SignedCredentialResponse

export function computeJWTSignature(payload: jwtPayload, privateKey: Buffer): string {
  const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
  return decodeToken(signed).signature
}

export function encodeAsJWT(header: IJWTHeader, payload: jwtPayload, signature: string): string {
  const jwtParts = []
  jwtParts.push(base64url.encode(JSON.stringify(header)))
  jwtParts.push(base64url.encode(JSON.stringify(payload)))
  jwtParts.push(signature)
  return jwtParts.join('.')
}

export function validateJWTSignature(jwtInstance: jwtEnabledClass, pubKey: Buffer): boolean {
  if (!pubKey) {
    throw new Error('Please provide the issuer\'s public key')
  }

  const assembledJWT = jwtInstance.toJWT()
  return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
}

// TODO Find based on key id
export async function validateJWTSignatureWithRegistry(
  jwtInstance: jwtEnabledClass,
  registry: JolocomRegistry
): Promise<boolean> {
    if (!registry) {
      throw new Error('Can not instantiate default registry yet, WIP')
    }

    const issuerProfile = await registry.resolve(jwtInstance.getIssuer())
    const pubKey = issuerProfile.publicKey[0].publicKeyHex

    if (!pubKey) {
      return false
    }

    return validateJWTSignature(jwtInstance, Buffer.from(pubKey, 'hex'))
}
