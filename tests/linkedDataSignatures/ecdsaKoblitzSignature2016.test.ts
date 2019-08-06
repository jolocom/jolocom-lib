import * as sinon from 'sinon'
import { expect } from 'chai'

import { EcdsaLinkedDataSignature } from '../../ts/linkedDataSignature'
import {
  signatureAttributes,
  incompleteSignatureAttrs,
  normalizedSignatureSection,
} from './ecdsaSignature.data'
import { mockKeyId } from '../data/credential/signedCredential.data'

describe('EcdsaKoblitzSignature', () => {
  let signature: EcdsaLinkedDataSignature
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    signature = EcdsaLinkedDataSignature.fromJSON(signatureAttributes)
    expect(signature.toJSON()).to.deep.eq(signatureAttributes)
  })

  it('Should correctly default to empty values if members are missing when we toJSON', () => {
    const incompleteSignature = new EcdsaLinkedDataSignature()
    expect(incompleteSignature.toJSON()).to.deep.eq(incompleteSignatureAttrs)
  })

  it('Should implement getters method', () => {
    const {
      created,
      creator,
      nonce,
      signatureValue,
      type,
    } = signatureAttributes

    expect(signature.created).to.deep.eq(new Date(created))
    expect(signature.creator).to.eq(creator)
    expect(signature.nonce).to.eq(nonce)
    expect(signature.signature).to.deep.eq(signatureValue)
    expect(signature.type).to.deep.eq(type)
  })

  it('Should implement normalize', async () => {
    expect(await signature.normalize()).to.deep.equal(
      normalizedSignatureSection,
    )
  })

  it('Should implement setters', () => {
    const bareSignature = new EcdsaLinkedDataSignature()
    bareSignature.created = new Date(0)
    bareSignature.creator = mockKeyId
    bareSignature.nonce = '1842fb5f567dd532'
    bareSignature.signature = 'abcdef'

    expect(bareSignature.toJSON()).to.deep.eq(signatureAttributes)
  })
})
