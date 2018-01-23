import { expect } from 'chai'
import DidDocument from '../ts/identity/didDocument'
import testData from './testData'

describe('Did Document', () => {
  let ddo = new DidDocument(testData.testUserPublicKey)

  it('Should include context field which specifies the version of DID specification', () => {
    expect(ddo.context).to.equal('https://w3id.org/did/v1')
  })
})

