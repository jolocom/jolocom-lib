import { expect } from 'chai'
import { jsonAuthentication } from '../data/interactionTokens/authentication.data'
import { Authentication } from '../../ts/interactionTokens/authentication'

describe('Authentication', () => {
  let auth: Authentication

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    auth = Authentication.fromJSON(jsonAuthentication)
    expect(auth.toJSON()).to.deep.eq(jsonAuthentication)
  })

  it('Should implement getters method', () => {
    expect(auth.callbackURL).to.eq(jsonAuthentication.callbackURL)
    expect(auth.challenge).to.eq(jsonAuthentication.challenge)
  })
})
