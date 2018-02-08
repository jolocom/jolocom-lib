import { expect } from 'chai'
import Did from '../ts/identity/did'
import testDataIdentity from './data/identity'
import testDataKeys from './data/keys'
import * as bitcoin from 'bitcoinjs-lib'
import * as lolex from 'lolex'
import * as sinon from 'sinon'

describe('DID', () => {

    const publicKey = Buffer.from(testDataIdentity.testUserPublicKey, 'hex')
    const did = new Did(publicKey)
    const clock = lolex.install({now: new Date('2018-01-24T15:42:15.882Z')})

  it('Should correctly instantiate a DID class from user public key', () => {
    const expected = testDataIdentity.testUserDID
    expect(did.identifier).to.be.a('string')
    expect(did.identifier).to.equal(expected)
  })


  it('Should contain a method which correctly generates and returns a signed verifiable credential' , () => {
    const credentialType = ['Credential']
		const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver:21}
    const result = did.createVerifiableCredential(credentialType, claim, testDataKeys.testGenericKeyPairWIF)
    expect(JSON.stringify(result)).to.equal(JSON.stringify(testDataIdentity.expectedSignedCredential))
  })

  it('Should contain a method which can verify a signed credential', () => {
    const genericKeyPair = bitcoin.ECPair.fromWIF(testDataKeys.testGenericKeyPairWIF)
    const genericPublicKey = genericKeyPair.getPublicKeyBuffer()

    const credentialType = ['Credential']
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver:21}
    const signed = did.createVerifiableCredential(credentialType, claim, testDataKeys.testGenericKeyPairWIF)
    const result = did.verifySignedCredential(signed, genericPublicKey)
    expect(result).to.equal(true)
  })
})
