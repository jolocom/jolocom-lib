import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { ISignedCredRequestPayload, IJWTHeader } from '../credentialRequest/signedCredentialRequest/types'
import { ISignedCredResponsePayload } from '../credentialResponse/signedCredentialResponse/types'
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { SignedCredentialResponse } from '../credentialResponse/signedCredentialResponse/signedCredentialResponse'

export type jwtPayload = ISignedCredRequestPayload | ISignedCredResponsePayload

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

export function validateJWTSignature(
  jwtInstance: SignedCredentialRequest | SignedCredentialResponse,
  pubKey: Buffer
): boolean {
  if (!pubKey) {
    throw new Error('Please provide the issuer\'s public key')
  }

  const assembledJWT = jwtInstance.toJWT()
  return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
}
