import { expect } from 'chai'
import Did from '../ts/identity/did'
import testData from './data/identity'

describe('DID', () => {
  it('Should correctly instantiate a DID class from user public key', () => {
    const publicKey = Buffer.from(testData.testUserPublicKey, 'utf8')
    const did = new Did(publicKey)
    const result = testData.testUserDID
    expect(did.identifier).to.be.a('string')
    expect(did.identifier).to.equal(result)
  })
})
