import { expect } from 'chai'
import DidDocument from '../ts/identity/didDocument'
import { DidDocumentAttrs } from '../ts/identity/types'
import testData from './data/identity'
import * as lolex from 'lolex'

describe('Did Document', () => {
  const clock = lolex.install({now: new Date('2018-01-24T15:42:15.882Z')})
  const publicKey = Buffer.from(testData.testUserPublicKey, 'utf8')
  const ddo = DidDocument.create(publicKey)

  it('Should include context field which specifies the version of DID specification', () => {
    expect(JSON.stringify(ddo)).to.contain('https://w3id.org/did/v1')
  })

  it('Should include properly formatted authentication credentials of ecdsa key', () => {
    expect(JSON.stringify(ddo)).to.equal(JSON.stringify(testData.expectedDdoJson))
  })

  it('Should be parsed back to DdoDocument correctly', () => {
		let parsed = JSON.parse(JSON.stringify(ddo), DidDocument.reviver)
    expect(parsed).to.deep.equal(ddo)
  })
})
