import { expect } from 'chai'
import { AuthenticationResponse } from '../../ts/interactionFlows/authenticationResponse/authenticationResponse'
import { challengeResponse, jsonAuthResponse } from '../data/interactionFlows/authenticationResponse'

describe('AuthenticationResponse', () => {
  const authenticationResponse = AuthenticationResponse
    .create({challengeResponse})

  it('Should create instace of AuthenticationResponse on static create', () => {  
    expect(authenticationResponse).to.be.instanceOf(AuthenticationResponse)
    expect(authenticationResponse).to.deep.equal(AuthenticationResponse.fromJSON(jsonAuthResponse))
  })

  it('Should expose class specific methods on authenticationResponse', async () => {
    expect(authenticationResponse.getChallengeResponse()).to.deep.equal(challengeResponse)
    // TODO: adjust when validateChallengeResponse is implemented
    expect(await authenticationResponse.validateChallengeResponse()).to.be.false
  })

  it('Should implement toJSON method', () => {
    expect(authenticationResponse.toJSON()).to.deep.equal(jsonAuthResponse)
  })

  it('Should implement static fromJSON method', () => {
    const authResponse = AuthenticationResponse.fromJSON(jsonAuthResponse)
    
    expect(authResponse).to.be.instanceOf(AuthenticationResponse)
    expect(authResponse).to.deep.equal(authenticationResponse)
  })
})