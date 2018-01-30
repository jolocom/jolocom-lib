import { expect } from 'chai'
import Did from '../ts/identity/did'
import AuthenticationCredential from '../ts/identity/authenticationCredential'
import testData from './data/identity'

describe('Authentication credential' , () => {
  const publicKey = Buffer.from(testData.testUserPublicKey, 'utf8')
  const did = new Did(publicKey)
  const authCredential = AuthenticationCredential.ecdsaCredentials(testData.testUserPublicKey, did)

  it('Should include owners Did', () => {
    expect(authCredential.owner).to.equal(did)
  })

  it('Should include keys identifier', () => {
    expect(authCredential.id.toJSON()).to.equal(`${did.toJSON()}#keys/generic/1`)
  })

  it('Should stringify to a correct DDO specified format', () => {
    expect(JSON.stringify(authCredential))
      .to.equal(JSON.stringify(testData.expectedDdoJson.authenticationCredential))
  })

  it('AuthenticationCredential JSON should be parsed back to the same AuthenticationCredential object', () => {
    const parsed = JSON.parse(JSON.stringify(authCredential), AuthenticationCredential.reviver)
    expect(parsed).to.deep.equal(authCredential)
  })
})

