import { expect } from 'chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { jsonCredReceive } from '../data/interactionTokens/credentialReceive.data'
import { CredentialsReceive } from '../../ts/interactionTokens/credentialsReceive'
import { credentialSet } from '../data/interactionTokens/credentialRequest.data'

describe('CredentialsReceive', () => {
  let credReceive: CredentialsReceive

  it('Should implement static fromJSON', () => {
    credReceive = CredentialsReceive.fromJSON(jsonCredReceive)
    expect(credReceive.toJSON()).to.deep.eq(jsonCredReceive)
  })

  it('Should implement getters method', () => {
    expect(credReceive.signedCredentials).to.deep.eq(
      credentialSet.map(SignedCredential.fromJSON),
    )
  })
})
