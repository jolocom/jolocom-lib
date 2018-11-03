import { expect } from 'chai'
import { jsonAuthentication } from '../data/interactionFlows/authentication'
import { Authentication } from '../../ts/interactionFlows/authentication'

describe('Authentication', () => {
  let auth: Authentication

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    auth = Authentication.fromJSON(jsonAuthentication)
    expect(auth.toJSON()).to.deep.eq(jsonAuthentication)
  })

  it('Should implement getters method', () => {
    expect(auth.getCallbackURL()).to.eq(jsonAuthentication.callbackURL)
    expect(auth.getChallenge()).to.eq(jsonAuthentication.challenge)
  })
})
