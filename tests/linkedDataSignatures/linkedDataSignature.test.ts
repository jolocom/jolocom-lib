import * as sinon from 'sinon'
import { expect } from 'chai'
import * as jsonld from 'jsonld'

import { LinkedDataSignature } from '../../ts/linkedDataSignature'
import {
  signatureAttributes,
  signatureSectionAsBytes,
} from './ecdsaSignature.data'
import { mockKeyId } from '../data/credential/signedCredential.data'
import { LinkedDataSignatureSuite } from '../../ts/linkedDataSignature/types'

describe('Linked Data Signature', () => {
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
    //    stubbedCanonise.restore()
  })

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    const signature = LinkedDataSignature.fromJSON(signatureAttributes)
    expect(signature.toJSON()).to.deep.eq(signatureAttributes)
  })

  it('Should correctly default to empty values if members are missing when we toJSON', () => {
    const incompleteSignature = new LinkedDataSignature()
    expect(incompleteSignature.signature).equals(undefined)
    expect(incompleteSignature.creator).equals(undefined)
    expect(incompleteSignature.type).equals(undefined)
    expect(incompleteSignature.created).equals(undefined)
  })

  it('Should implement getters method', () => {
    const {
      created,
      creator,
      nonce,
      signatureValue,
      type,
    } = signatureAttributes

    const signature = LinkedDataSignature.fromJSON(signatureAttributes)

    expect(signature.created).to.deep.eq(new Date(created))
    expect(signature.creator).to.eq(creator)
    expect(signature.nonce).to.eq(nonce)
    expect(signature.signature).to.deep.eq(signatureValue)
    expect(signature.type).to.deep.eq(type)
  })

  it('Should implement normalize', async () => {
    const signature = LinkedDataSignature.fromJSON(signatureAttributes)

    expect((await signature.asBytes()).toString('hex')).to.deep.eq(
      signatureSectionAsBytes.toString('hex'),
    )
  })

  it('Should implement setters', () => {
    const bareSignature = new LinkedDataSignature()
    bareSignature.created = new Date(0)
    bareSignature.creator = mockKeyId
    bareSignature.nonce = '1842fb5f567dd532'
    bareSignature.signature = 'abcdef'
    bareSignature.type = LinkedDataSignatureSuite.EcdsaKoblitzSignature2016

    expect(bareSignature.toJSON()).to.deep.eq(signatureAttributes)
  })
})
