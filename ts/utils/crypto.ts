import * as wallet from 'ethereumjs-wallet'
import * as fetch from 'node-fetch'
import { decode } from 'wif'
import * as createHash from 'create-hash'
import * as secp256k1 from 'secp256k1'
import { keccak256 } from 'ethereumjs-util'

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

export function wifToAddress(wif: string) {
  return `0x${new wallet(decode(wif).privateKey).getAddress().toString('hex')}`
}

export async function requestEth(address: string) {
  const fuelingEndpoint = 'https://faucet.jolocom.com/request/'
  try {
    const res = await fetch(fuelingEndpoint, {
      method: 'POST',
      body: JSON.stringify({ address }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    throw new Error(`Fueling failed, ${address}, ${fuelingEndpoint}. Err - ${err.message}`)
  }
}

export function publicKeyToDID(publicKey: Buffer): string {
  const prefix = 'did:jolo:'
  const suffix = keccak256(publicKey)
  return prefix + suffix.toString('hex')
}

export function privateKeyToPublicKey(privateKey: Buffer): Buffer {
  return secp256k1.publicKeyCreate(privateKey)
}

export function privateKeyToDID(privateKey: Buffer): string {
  return publicKeyToDID(privateKeyToPublicKey(privateKey))
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
