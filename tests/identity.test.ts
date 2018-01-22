import * as bs58 from 'bs58'
import { expect } from 'chai'
import DID from '../ts/identity'
import testData from './testData'

describe('DID', () => {
  it('Should correctly instantiate a DID class from user public key', () => {
    const publicKey = Buffer.from(testData.testUserPublicKey, 'utf8')
    const did = new DID(publicKey)
    const result = testData.testUserDID
    expect(did.identifier).to.be.a('string')
    expect(did.identifier).to.equal(result)
  })
})

/*

new DID()

DID.verifySignedMessage
DID.signMessage
DID.getKeyPairOfSigningKey(?)
DID.encryptMessage(?)
DID.decryptMessage(?)
DID.findVerifications(?)

it should produce a DID bound to the user's XXX public key

*/
