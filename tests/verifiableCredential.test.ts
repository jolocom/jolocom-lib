import { expect } from 'chai'
import VerifiableCredential from '../ts/identity/verifiableCredential'
import testData from './data/identity'
import * as lolex from 'lolex'
import * as sinon from 'sinon'

describe('VerifiableCredential', () => {
  const clock = lolex.install({now: new Date('2018-01-24T15:42:15.882Z')})
  sinon.stub(VerifiableCredential.prototype, 'generateVerifiableCredentialID').returns('11111')

  it('Should correctly instantiate a Verifiable Credential', () => {
		const credentialType = ['Credential']
    const issuerID ='did:jolo:0x0aecaae09eb4b6433a4136fbac29a5ea93dd3593dd120e16a314744d3945d119',
		const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver:21}
		const vc = new VerifiableCredential(credentialType, issuerID, claim)
    expect(JSON.stringify(vc)).to.equal(JSON.stringify(testData.expectedVerifiedCredential))
	})
})
