import { expect } from 'chai'
import { AuthenticationResponsePayload } from '../../ts/interactionFlows/authenticationResponse/authenticationResponsePayload'
import {
  jsonAuthResponse,
  jsonAuthResponsePayload
} from '../data/interactionFlows/authenticationResponse'
import { AuthenticationResponse } from '../../ts/interactionFlows/authenticationResponse/authenticationResponse';

describe('AuthenticationResponsePayload', () => {
  const authResponsePayload = AuthenticationResponsePayload.create({
    typ: 'authenticationResponse',
    authResponse: jsonAuthResponse
  }) 
  
  it('Should implement static create method and return correct instance', () => {
    authResponsePayload.iat = jsonAuthResponsePayload.iat
    authResponsePayload.iss = jsonAuthResponsePayload.iss

    expect(authResponsePayload).to.be.instanceOf(AuthenticationResponsePayload)
    expect(authResponsePayload.authResponse).to.be.instanceOf(AuthenticationResponse)
    expect(authResponsePayload)
      .to.deep.equal(AuthenticationResponsePayload.fromJSON(jsonAuthResponsePayload))
  })
 
  it('Should expose class specific methods', () => {
    expect(authResponsePayload.getAuthenticationResponse).to.exist
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(authResponsePayload.toJSON()).to.deep.equal(jsonAuthResponsePayload)
  })

  it('Should correctly implement static fromJSON method', () => {    
    expect(AuthenticationResponsePayload.fromJSON(jsonAuthResponsePayload))
      .to.deep.equal(authResponsePayload)
  })
})