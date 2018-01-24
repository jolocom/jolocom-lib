import { expect } from 'chai'
import Did from '../ts/identity/did'
import * as AuthenticationCredential from '../ts/identity/authenticationCredential'
import testData from './data/identity'

describe('Authentication credential' , () => {
  const did = new Did(testData.testUserPublicKey)
  let authCredential = AuthenticationCredential.ecdsaAuthenticationCredentials(testData.testUserPublicKey, did)

  it('Should include owners Did', () => {
    expect(authCredential.owner).to.equal(did)
  })

  it('Should include keys identifier', () => {
    expect(authCredential.id).to.equal(did + 'keys/generic/1')
  })
})

