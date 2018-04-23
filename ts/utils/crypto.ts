import { random } from 'sjcl'
import * as createHash from 'create-hash'
import * as secp256k1 from 'secp256k1'
import { keccak256 } from 'ethereumjs-util'

export function sha256(data: Buffer): Buffer {
  return createHash('sha256').update(data).digest()
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

export function generateRandomID(nrOfBytes: number): string {
  const result = Buffer.allocUnsafe(nrOfBytes)
  random.randomWords(nrOfBytes / 4).forEach((el, index) => {
    result.writeInt32LE(el, index * 4)
  })

  return result.toString('hex')
}
