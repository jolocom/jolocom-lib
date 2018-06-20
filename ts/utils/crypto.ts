import base64url from 'base64url'
import { TokenSigner, decodeToken } from 'jsontokens'
import * as createHash from 'create-hash'
import * as secp256k1 from 'secp256k1'
import { keccak256 } from 'ethereumjs-util'
import { IJWTHeader, ISignedCredRequestPayload } from '../credentialRequest/signedCredentialRequest/types'
import { ISignedCredResponsePayload } from '../credentialResponse/signedCredentialResponse/types'

export function sha256(data: Buffer): Buffer {
  return createHash('sha256')
    .update(data)
    .digest()
}

export function sign(data: string, privateKey: Buffer) {
  const hash = sha256(Buffer.from(data))
  const sigObj = secp256k1.sign(hash, privateKey)
  return sigObj.signature.toString('base64')
}

export function verifySignature(data: string, publicKey: Buffer, signature: Buffer): boolean {
  const hash = sha256(Buffer.from(data))
  return secp256k1.verify(hash, signature, publicKey)
}

export function publicKeyToDID(publicKey: Buffer): string {
  const prefix = 'did:jolo:'
  const suffix = keccak256(publicKey)
  return prefix + suffix.toString('hex')
}

export function privateKeyToDID(privateKey: Buffer): string {
  const pubKey = secp256k1.publicKeyCreate(privateKey)
  return publicKeyToDID(pubKey)
}

type jwtPayload = ISignedCredRequestPayload | ISignedCredResponsePayload
export function encodeAsJWT(header: IJWTHeader, payload: jwtPayload, signature: string): string {
  const jwtParts = []
  jwtParts.push(base64url.encode(JSON.stringify(header)))
  jwtParts.push(base64url.encode(JSON.stringify(payload)))
  jwtParts.push(signature)
  return jwtParts.join('.')
}

export function computeJWTSignature(payload: jwtPayload, privateKey: Buffer): string {
  let serializedPayload

  if ((payload as ISignedCredRequestPayload).credentialRequest) {
    serializedPayload = {
      ...payload,
      credentialRequest: (payload as ISignedCredRequestPayload).credentialRequest.toJSON()
    }
  } else if ((payload as ISignedCredResponsePayload).credentialResponse) {
    serializedPayload = {
      ...payload,
      credentialResponse: (payload as ISignedCredResponsePayload).credentialResponse.toJSON()
    }
  }

  const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
  return decodeToken(signed).signature
}

// TODO Seed properly, causes issues on RN due to lack of default csrng operations.
export function generateRandomID(nrOfBytes: number): string {
  return Math.random()
    .toString(16)
    .substr(2)
  /*
  const result = Buffer.allocUnsafe(nrOfBytes)
  random.randomWords(nrOfBytes / 4).forEach((el, index) => {
    result.writeInt32LE(el, index * 4)
  })

  return result.toString('hex')
  */
}
