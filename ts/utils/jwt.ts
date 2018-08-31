import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { ISignedCredRequestPayload, IJWTHeader } from '../credentialRequest/signedCredentialRequest/types'
import { ISignedCredResponsePayload } from '../credentialResponse/signedCredentialResponse/types'
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { SignedCredentialResponse } from '../credentialResponse/signedCredentialResponse/signedCredentialResponse'
import { JolocomRegistry } from '../registries/jolocomRegistry'
import { JSONWebToken } from '../interactionFlows/jsonWebToken';
import { IPayload } from '../interactionFlows/types';

export type jwtPayload = ISignedCredRequestPayload | ISignedCredResponsePayload
export type jwtEnabledClass = SignedCredentialRequest | SignedCredentialResponse

export interface Ideprecated_IValidateJWTSignatureWithRegistryArgs {
  jwtInstance: jwtEnabledClass
  registry: JolocomRegistry
}

export interface IValidateJWTSignatureWithRegistryArgs {
  jwtInstance: JSONWebToken
  registry: JolocomRegistry
}

export function deprecated_computeJWTSignature(payload: jwtPayload, privateKey: Buffer): string {
  const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
  return decodeToken(signed).signature
}

export function computeJWTSignature(payload: IPayload, privateKey: Buffer): string {
  const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
  return decodeToken(signed).signature
}

export function deprecated_encodeAsJWT(header: IJWTHeader, payload: jwtPayload, signature: string): string {
  const jwtParts = []
  jwtParts.push(base64url.encode(JSON.stringify(header)))
  jwtParts.push(base64url.encode(JSON.stringify(payload)))
  jwtParts.push(signature)
  return jwtParts.join('.')
}

export function encodeAsJWT(header: IJWTHeader, payload: IPayload, signature: string): string {
  const jwtParts = []
  jwtParts.push(base64url.encode(JSON.stringify(header)))
  jwtParts.push(base64url.encode(JSON.stringify(payload)))
  jwtParts.push(signature)
  return jwtParts.join('.')
}

export function deprecated_validateJWTSignature(jwtInstance: jwtEnabledClass, pubKey: Buffer): boolean {
  if (!pubKey) {
    throw new Error('Please provide the issuer\'s public key')
  }

  // TODO Normalize / have a cannonical json form
  const assembledJWT = jwtInstance.toJWT()
  return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
}
export function validateJWTSignature(jwtInstance: JSONWebToken, pubKey: Buffer): boolean {
  if (!pubKey) {
    throw new Error('Please provide the issuer\'s public key')
  }

  // TODO Normalize / have a cannonical json form
  const assembledJWT = jwtInstance.toJWT()
  return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
}
// TODO Find based on key id
export async function deprecated_validateJWTSignatureWithRegistry(
  args: Ideprecated_IValidateJWTSignatureWithRegistryArgs
): Promise<boolean> {
  const { jwtInstance, registry } = args

  const issuerProfile = await registry.resolve(jwtInstance.getIssuer())
  const pubKey = issuerProfile.getPublicKeySection()[0].getPublicKeyHex()
  if (!pubKey) {
    return false
  }

  return deprecated_validateJWTSignature(jwtInstance, Buffer.from(pubKey, 'hex'))
}

// TODO Find based on key id
export async function validateJWTSignatureWithRegistry(args: IValidateJWTSignatureWithRegistryArgs): Promise<boolean> {
  const { jwtInstance, registry } = args

  const issuerProfile = await registry.resolve(jwtInstance.getIssuer())
  const pubKey = issuerProfile.getPublicKeySection()[0].getPublicKeyHex()
  if (!pubKey) {
    return false
  }

  return validateJWTSignature(jwtInstance, Buffer.from(pubKey, 'hex'))
}
