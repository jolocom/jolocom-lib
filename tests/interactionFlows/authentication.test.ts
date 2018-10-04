import { expect } from 'chai'
import { Authentication } from '../../ts/interactionFlows/authentication/authentication'
import { jsonAuthentication, callbackURL, challenge } from '../data/interactionFlows/authentication'

describe('Authentication', () => {
  const authentication = Authentication.create({callbackURL, challenge})

  it('Should create instace of AuthenticationRequest on static create', () => {  
    expect(authentication).to.be.instanceOf(Authentication)
    expect(authentication).to.deep.equal(Authentication.fromJSON(jsonAuthentication))
  })

  it('Should expose class specific methods on authenticationRequest', () => {
    expect(authentication.getCallbackURL()).to.deep.equal(callbackURL)
    expect(authentication.getChallenge()).to.deep.equal(challenge)
  })

  it('Should implement toJSON method', () => {
    expect(authentication.toJSON()).to.deep.equal(jsonAuthentication)
  })

  it('Should implement static fromJSON method', () => {
    const auth = Authentication.fromJSON(jsonAuthentication)
    
    expect(auth).to.be.instanceOf(Authentication)
    expect(auth).to.deep.equal(authentication)
  })
})