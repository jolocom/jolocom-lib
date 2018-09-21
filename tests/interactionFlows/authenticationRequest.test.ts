import { expect } from 'chai'
import { AuthenticationRequest } from '../../ts/interactionFlows/authenticationRequest/authenticationRequest'
import { jsonAuthRequest, callbackURL, challenge } from '../data/interactionFlows/authenticationRequest'

describe('AuthenticationRequest', () => {
  const authenticationRequest = AuthenticationRequest
    .create({callbackURL, challenge})

  it('Should create instace of AuthenticationRequest on static create', () => {  
    expect(authenticationRequest).to.be.instanceOf(AuthenticationRequest)
    expect(authenticationRequest).to.deep.equal(AuthenticationRequest.fromJSON(jsonAuthRequest))
  })

  it('Should expose class specific methods on authenticationRequest', () => {
    expect(authenticationRequest.getCallbackURL()).to.deep.equal(callbackURL)
    expect(authenticationRequest.getChallenge()).to.deep.equal(challenge)
  })

  it('Should implement toJSON method', () => {
    expect(authenticationRequest.toJSON()).to.deep.equal(jsonAuthRequest)
  })

  it('Should implement static fromJSON method', () => {
    const authRequest = AuthenticationRequest.fromJSON(jsonAuthRequest)
    
    expect(authRequest).to.be.instanceOf(AuthenticationRequest)
    expect(authRequest).to.deep.equal(authenticationRequest)
  })
})