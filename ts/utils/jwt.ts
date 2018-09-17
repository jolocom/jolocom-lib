import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { JolocomRegistry } from '../registries/jolocomRegistry'
import { JSONWebToken } from '../interactionFlows/JSONWebToken'
import { IPayload, IJWTHeader } from '../interactionFlows/types'

export interface IValidateJWTSignatureWithRegistryArgs {
  jwtInstance: JSONWebToken<IPayload>
  registry: JolocomRegistry
}

export function computeJWTSignature(payload: IPayload, privateKey: Buffer): string {
  const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
  return decodeToken(signed).signature
}

export function encodeAsJWT(header: IJWTHeader, payload: IPayload, signature: string): string {
  const jwtParts = []
  jwtParts.push(base64url.encode(JSON.stringify(header)))
  jwtParts.push(base64url.encode(JSON.stringify(payload)))
  jwtParts.push(signature)
  return jwtParts.join('.')
}

export function validateJWTSignature(jwtInstance: JSONWebToken<IPayload>, pubKey: Buffer): boolean {
  if (!pubKey) {
    throw new Error('Please provide the issuer\'s public key')
  }

  // TODO Normalize / have a cannonical json form
  const assembledJWT = jwtInstance.encode()
  return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
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
