import { expect } from 'chai'
import testSignVerifyData from './data/sign-verify'
import * as bitcoinMessage from 'bitcoinjs-message'
import * as bitcoin from 'bitcoinjs-lib'

describe('signMessage', () => {
  it('should produce a valid signed message', () => {
    const message = testSignVerifyData.message
    const WIF = testSignVerifyData.genericSigningKeyWIF
    const keyPair = bitcoin.ECPair.fromWIF(WIF)
    const privateKey = keyPair.d.toBuffer(32)

    const sigBuffer = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
    const signedMessage = sigBuffer.toString('base64')
    expect(signedMessage).to.equal(testSignVerifyData.signedMessage)
  })
})

describe('verifySignedMessage', () => {
  it('should return true for valid signedMessage', () => {
    const message = testSignVerifyData.message
    const signedMessage = testSignVerifyData.signedMessage
    const address = testSignVerifyData.address

    const verify = bitcoinMessage.verify(message, address, signedMessage)
    expect(verify).to.equal(true)
  })

  it('should return false for invalid signedMessage', () => {
    const message = testSignVerifyData.message
    const signedMessage = 'H4rnkGPeavehMEphGIKdThrg/4VQN3hRKci/C2y0QLrPVPhzQwPKlU2FKmyEtFFPlKgwDTBGwqbT8+54vS6rr0I='
    const address = testSignVerifyData.address

    const verify = bitcoinMessage.verify(message, address, signedMessage)
    expect(verify).to.equal(false)
  })
})
