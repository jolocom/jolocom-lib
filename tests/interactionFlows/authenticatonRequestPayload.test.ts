import { expect } from 'chai'
import { AuthenticationRequestPayload } from '../../ts/interactionFlows/authenticationRequest/authenticationRequestPayload'
import { AuthenticationRequest } from '../../ts/interactionFlows/authenticationRequest/authenticationRequest'
import { 
  callbackURL,
  challenge,
  jsonAuthRequestPayload,
  mockJsonAuthRequestPayload
} from '../data/interactionFlows/authenticationRequest'

describe('AuthenticationRequestPayload', () => {
  const authRequestPayload = AuthenticationRequestPayload.create({
    typ: 'authenticationRequest',
    authRequest: AuthenticationRequest.create({challenge, callbackURL})
  }) 

  it('Should expose class specific methods on authenticationRequestPayload', () => {
    expect(authRequestPayload.getCallbackURL()).to.deep.equal(callbackURL)
    expect(authRequestPayload.getChallenge()).to.deep.equal(challenge)
  })
  
  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(authRequestPayload.toJSON()).to.deep.equal(jsonAuthRequestPayload)
  })

  it('Should implement static create method and return correct instance', () => {
    authRequestPayload.iat = mockJsonAuthRequestPayload.iat
    authRequestPayload.iss = mockJsonAuthRequestPayload.iss

    expect(authRequestPayload).to.be.instanceOf(AuthenticationRequestPayload)
    expect(authRequestPayload).to.deep.equal(AuthenticationRequestPayload.fromJSON(mockJsonAuthRequestPayload))
  })

  it('Should correctly implement static fromJSON method', () => {
    authRequestPayload.iss = mockJsonAuthRequestPayload.iss
    authRequestPayload.iat = mockJsonAuthRequestPayload.iat
    
    expect(AuthenticationRequestPayload.fromJSON(mockJsonAuthRequestPayload))
      .to.deep.equal(authRequestPayload)
  })
})