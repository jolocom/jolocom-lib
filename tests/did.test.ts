import { expect } from 'chai'
import Did from '../ts/identity/did'
import testDataIdentity from './data/identity'
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
})
