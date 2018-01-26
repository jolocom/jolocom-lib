import * as bitcoinMessage from 'bitcoinjs-message'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'

export function signMessage(WIF : String, message : String) {
  const keyPair = bitcoin.ECPair.fromWIF(WIF)
  const privateKey = keyPair.d.toBuffer(32)

  const sigBuffer = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
  const signedMessage = sigBuffer.toString('base64')
  return signedMessage
}

export function verifySignedMessage(
  message : String,
  address : String,
  signedMessage : String
) {
  return bitcoinMessage.verify(message, address, signedMessage)
}
