import * as bitcoinMessage from 'bitcoinjs-message'
import { ECPair } from 'bitcoinjs-lib'

export function signMessage(WIF : String, message : String) : String {
  const keyPair = ECPair.fromWIF(WIF)
  const privateKey = keyPair.d.toBuffer(32)

  const sigBuffer = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
  const signedMessage = sigBuffer.toString('base64')
  return signedMessage
}

export function verifySignedMessage(
  message : String,
  address : String,
  signedMessage : String
) : boolean {
  return bitcoinMessage.verify(message, address, signedMessage)
}
