import * as chai from 'chai'
import { ddoAttr, signedCredJSON } from '../data/identity'
import { Identity } from '../../ts/identity/identity'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { DidDocument } from '../../ts/identity/didDocument';

const expect = chai.expect

describe('Identity', () => {
  const identity = Identity
    .create({didDocument: ddoAttr, profile: SignedCredential.fromJSON(signedCredJSON)})

  it('should correctly instantiate Identity class', () => {
    expect(identity).to.haveOwnProperty('profile')
    expect(identity.didDocument).to.be.instanceof(DidDocument)
    expect(identity).to.be.instanceof(Identity)
  })

  it('should return a public profile claim section on publicProfile.get', () => {
    const publicProfile = identity.publicProfile.get()

    expect(publicProfile).to.deep.equal({ id: 'did:jolo:test', email: 'eugeniu@jolocom.com' })
  })
})
