import { expect } from 'chai'
import {
  CredentialRequest,
  constraintFunctions,
} from '../../ts/interactionTokens/credentialRequest'
import { mockKeyId } from '../data/credential/signedCredential.data'
import {
  credentialSet,
  extendedCredRequestJSON,
  simpleCredRequestJSON,
  emptyConstraintsRequestJSON,
  undefinedConstraintsRequestJSON,
  expectedIsOutput,
  expectedNotOutput,
  expectedGreaterOutput,
  expectedSmallerOutput,
} from '../data/interactionTokens/credentialRequest.data'

describe('CredentialRequest', () => {
  let credReq: CredentialRequest

  it('Should implement static fromJSON', () => {
    credReq = CredentialRequest.fromJSON(extendedCredRequestJSON)
    expect(credReq.toJSON()).to.deep.eq(extendedCredRequestJSON)
  })

  it('Should implement getters method', () => {
    const { callbackURL, credentialRequirements } = extendedCredRequestJSON
    expect(credReq.callbackURL).to.eq(callbackURL)
    expect(credReq.credentialRequirements).to.deep.eq(credentialRequirements)
    expect(credReq.requestedCredentialTypes).to.deep.eq([
      credentialRequirements[0].type,
      credentialRequirements[1].type,
    ])
  })

  describe('ApplyConstraints', () => {
    it('Should correctly filter based empty constraint section', () => {
      const simpleCredReq = CredentialRequest.fromJSON(
        emptyConstraintsRequestJSON,
      )
      expect(simpleCredReq.applyConstraints(credentialSet)).to.deep.eq(
        credentialSet,
      )
    })

    it('Should correctly handle undefined or unincluded constraints', () => {
      const simpleCredReq = CredentialRequest.fromJSON(
        undefinedConstraintsRequestJSON,
      )
      expect(simpleCredReq.applyConstraints(credentialSet)).to.be.empty
    })

    it('Should correctly filter based on issuer', () => {
      const simpleCredReq = CredentialRequest.fromJSON(simpleCredRequestJSON)
      expect(simpleCredReq.applyConstraints(credentialSet)).to.deep.eq([
        credentialSet[1],
      ])
    })
  })

  describe('Constraint creation functions', () => {
    it('Should expose expected public interface', () => {
      const expectedKeys = ['is', 'not', 'greater', 'smaller']
      expect(Object.keys(constraintFunctions)).to.deep.eq(expectedKeys)
    })

    it('Should correctly create constraint functions', () => {
      expect(constraintFunctions.is('claim.id', mockKeyId)).to.deep.eq(
        expectedIsOutput,
      )
      expect(constraintFunctions.not('claim.id', mockKeyId)).to.deep.eq(
        expectedNotOutput,
      )
      expect(constraintFunctions.greater('issued', new Date(0))).to.deep.eq(
        expectedGreaterOutput,
      )
      expect(constraintFunctions.smaller('issued', new Date(100))).to.deep.eq(
        expectedSmallerOutput,
      )
    })
  })
})
