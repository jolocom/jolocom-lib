import { expect } from 'chai'
import { AuthenticationResponsePayload } from '../../ts/interactionFlows/authenticationResponse/authenticationResponsePayload'
import {
  challengeResponse,
  jsonAuthResponse,
  jsonAuthResponsePayload,
  mockJsonAuthResponsePayload
} from '../data/interactionFlows/authenticationResponse'

describe('AuthenticationResponsePayload', () => {
  const authResponsePayload = AuthenticationResponsePayload.create({
    typ: 'authenticationResponse',
    authResponse: jsonAuthResponse
  }) 

  it('Should implement static create method and return correct instance', () => {
    expect(authResponsePayload).to.be.instanceOf(AuthenticationResponsePayload)
  })

  it('Should expose class specific methods on authenticationResponsePayload', async () => {
    expect(authResponsePayload.getChallengeResponse()).to.deep.equal(challengeResponse)
    // TODO
    expect(await authResponsePayload.validateChallengeResponse()).to.be.false
  })
  
  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(authResponsePayload.toJSON()).to.deep.equal(jsonAuthResponsePayload)
  })

  it('Should correctly implement static fromJSON method', () => {
    authResponsePayload.iss = mockJsonAuthResponsePayload.iss
    authResponsePayload.iat = mockJsonAuthResponsePayload.iat
    
    expect(AuthenticationResponsePayload.fromJSON(mockJsonAuthResponsePayload))
      .to.deep.equal(authResponsePayload)
  })
})