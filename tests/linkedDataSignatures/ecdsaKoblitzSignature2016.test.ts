import * as sinon from 'sinon'
import { expect } from 'chai'
import * as jsonld from 'jsonld'

import { EcdsaLinkedDataSignature } from '../../ts/linkedDataSignature'
import { signatureAttributes, normalizedSignatureSection, digestedSignatureSection, incompleteSignatureAttrs } from './ecdsaSignature.data'
import { defaultContext } from '../../ts/utils/contexts'
import { mockKeyId } from '../data/credential/signedCredential.data';

describe('EcdsaKoblitzSignature', () => {
  let signature: EcdsaLinkedDataSignature
  let clock
  let stubbedCanonise

  before(() => {
    clock = sinon.useFakeTimers()
    stubbedCanonise = sinon.stub(jsonld, 'canonize').returns(normalizedSignatureSection)
  })

  after(() => {
    clock.restore()
    stubbedCanonise.restore()
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
    const { created, creator, nonce, signatureValue, type } = signatureAttributes

    expect(signature.getCreationDate()).to.deep.eq(new Date(created))
    expect(signature.getCreator()).to.eq(creator)
    expect(signature.getNonce()).to.eq(nonce)
    expect(signature.getSignatureValue()).to.deep.eq(Buffer.from(signatureValue, 'hex'))
    expect(signature.getType()).to.deep.eq(type)
  })

  it('Should implement normalize', async () => {
    await signature.digest()
    const withContext = { ...signatureAttributes, '@context': defaultContext }
    delete withContext.signatureValue

    expect(stubbedCanonise.getCall(0).args).to.deep.eq([withContext])
    expect((await signature.digest()).toString('hex')).to.deep.eq(digestedSignatureSection)
  })

  it('Should implement setters', () => {
    const bareSignature = new EcdsaLinkedDataSignature()
    bareSignature.setCreationDate(new Date(0))
    bareSignature.setCreator(mockKeyId)
    bareSignature.setNonce('1842fb5f567dd532')
    bareSignature.setSignatureValue('abcdef')

    expect(bareSignature.toJSON()).to.deep.eq(signatureAttributes)
  })
})
