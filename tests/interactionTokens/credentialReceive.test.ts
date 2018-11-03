import { expect } from 'chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { jsonCredReceive } from '../data/interactionFlows/credentialReceive'
import { CredentialsReceive } from '../../ts/interactionFlows/credentialsReceive'
import { credentialSet } from '../data/interactionFlows/credentialRequest'

describe('CredentialsReceive', () => {
  let credReceive: CredentialsReceive

  it('Should implement static fromJSON', () => {
    credReceive = CredentialsReceive.fromJSON(jsonCredReceive)
    expect(credReceive.toJSON()).to.deep.eq(jsonCredReceive)
  })

  it('Should implement getters method', () => {
    expect(credReceive.getSignedCredentials()).to.deep.eq(credentialSet.map(SignedCredential.fromJSON))
  })
})
