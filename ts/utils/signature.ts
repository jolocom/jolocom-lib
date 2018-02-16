import * as createHash from 'create-hash'
import { sign, verify } from 'secp256k1'

export function sha256 (buffer) {
  return createHash('sha256').update(buffer).digest()
}

export function hash256 (buffer) {
  return sha256(sha256(buffer))
}

export function sign (message, privateKey, compressed) {
  const buffer = Buffer.from(JSON.stringify(message))
  const hash = hash256(buffer)
  const sigObj = secp256k1.sign(hash, privateKey)
  return sigObj.signature
 }

export function verify (message, publicKeyOfIssuer, signature) {
  const buffer = Buffer.from(JSON.stringify(message))
  const hash = hash256(buffer)
  const result = secp256k1.verify(hash, signature, publicKeyOfIssuer)
  return result
}
