import { expect } from 'chai'
import DidDocument from '../ts/identity/didDocument'
import testData from './testData'

describe('Did Document', () => {
  let ddo = new DidDocument(testData.testUserPublicKey)

  it('Should include context field which specifies the version of DID specification', () => {
    expect(ddo).to.equal('https://w3id.org/did/v1')
  })

  it('Should include properly formatted authentication credentials of ecdsa key', () => {
    expect(JSON.stringify(ddo)).to.equal(testData.expectedDdoJson)
  })
})
