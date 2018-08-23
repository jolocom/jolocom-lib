import * as chai from 'chai'
import { ddoAttr, publicProfileJSON } from '../data/identity'
import { Identity } from '../../ts/identity/identity'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { DidDocument } from '../../ts/identity/didDocument'
const expect = chai.expect

describe('Identity', () => {
  const publicProfileCredential = SignedCredential.fromJSON(publicProfileJSON)
  const identity = Identity.create({ didDocument: ddoAttr, profile: publicProfileCredential })

  it('should correctly instantiate Identity class', () => {
    expect(identity).to.haveOwnProperty('profile')
    expect(identity.didDocument).to.be.instanceof(DidDocument)
    expect(identity).to.be.instanceof(Identity)
  })

  it('should return a public profile claim section on publicProfile.get', () => {
    const publicProfile = identity.publicProfile.get()

    expect(publicProfile.getCredentialSection()).to.deep.equal(publicProfileJSON.claim)
  })

  it('should throw Error on publicProfile.get on identity instance without public profile', () => {
    const identityWallet = Identity.create({ didDocument: ddoAttr })
    expect(identityWallet.publicProfile.get()).to.be.false
  })

  describe('addPublicProfile', () => {
    it('should return an identity instance with a new public profile section', () => {
      const identityWithoutProfile = Identity.create({ didDocument: ddoAttr })

      expect(() => identityWithoutProfile.publicProfile.add(publicProfileCredential)).to.not.throw()
    })
  })
})
