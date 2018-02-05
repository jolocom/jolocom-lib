import { expect } from 'chai'
import testAuth from './data/authentication'
import {
  initiateSecretExchange,
  respondSecretExchange,
  getEncryptionSecret,
  encrypt,
  decrypt
} from './../ts/security/encryption'

describe('Secret exchange for encryption/decryption ', () => {
  let prime
  let initiatorKey
  let responderKey
  let initiator
  let responder
  let secret
  let cipherText

  it('initiateSecretExchange should return the correct values', () => {
    const res = initiateSecretExchange()
    prime = res.prime
    initiator = res.initiator
    initiatorKey = res.initiatorKey

    expect(res).to.have.property('prime')
    expect(res).to.have.property('initiator')
    expect(res).to.have.property('initiatorKey')
    expect(res.prime).to.be.a('string')
    expect(res.initiatorKey).to.be.a('string')
  }).timeout(15000)

  it('respondSecretExchange should return the correct values ', () => {
    const res = respondSecretExchange({prime: prime})
    responder = res.responder
    responderKey = res.responderKey

    expect(res).to.have.property('responder')
    expect(res.responderKey).to.be.a('string')
  })

  it('getEncryptionSecret: secret for party A should be equal to secret for party B ', () => {
    const res1 = getEncryptionSecret({party: initiator, pubKey: responderKey})
    const res2 = getEncryptionSecret({party: responder, pubKey: initiatorKey})
    secret = res1
    expect(res1.toString('hex')).to.equal(res2.toString('hex'))
  })

  it('encrypt should return a hex string ', () => {
    const res = encrypt({key: secret, plainText: [{favFood: 'dumplings'}]})
    cipherText = res
    expect(res).to.be.a('string')
  })

  it('decrypt should return the correct plain text ', () => {
    const res = decrypt({key: secret, cipherText})
    expect(res).to.deep.equal([{favFood: 'dumplings'}])
  })

})
