import { expect } from 'chai'
import { AuthenticationPayload } from '../../ts/interactionFlows/authentication/authenticationPayload'
import { Authentication } from '../../ts/interactionFlows/authentication/authentication'
import { 
  callbackURL,
  challenge,
  jsonAuthPayload,
  mockJsonAuthPayload,
  jsonAuthentication
} from '../data/interactionFlows/authentication'

describe('AuthenticationPayload', () => {
  const authPayload = AuthenticationPayload.create({
    typ: 'authentication',
    authentication: jsonAuthentication
  }) 

  it('Should expose class specific methods on authenticationPayload', () => {
    expect(authPayload.getCallbackURL()).to.deep.equal(callbackURL)
    expect(authPayload.getChallenge()).to.deep.equal(challenge)
    expect(authPayload.getAuthentication).to.exist
    expect(authPayload.validateChallenge).to.exist
  })
  
  it('Should return true on valid input on validateChallenge', () => {
    const authPayloadVerify = AuthenticationPayload.create({
      typ: 'authentication',
      authentication: jsonAuthentication
    })
    expect(authPayload.validateChallenge(authPayloadVerify)).to.be.true
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(authPayload.toJSON()).to.deep.equal(jsonAuthPayload)
  })

  it('Should implement static create method and return correct instance', () => {
    expect(authPayload).to.be.instanceOf(AuthenticationPayload)
    expect(authPayload.getAuthentication()).to.be.an.instanceOf(Authentication)
    expect(authPayload).to.deep.equal(AuthenticationPayload.fromJSON(jsonAuthPayload))
  })

  it('Should correctly implement static fromJSON method', () => {
    authPayload.iss = mockJsonAuthPayload.iss
    authPayload.iat = mockJsonAuthPayload.iat
    
    expect(AuthenticationPayload.fromJSON(mockJsonAuthPayload))
      .to.deep.equal(authPayload)
  })
})