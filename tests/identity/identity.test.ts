import { expect } from 'chai'
import * as sinon from 'sinon'
import { ddoAttr, testSignedCred } from '../data/identity'
import { Identity } from '../../ts/identity/identity'
import { Credential } from '../../ts/credentials/credential'
import { SignedCredential } from '../../ts/credentials/signedCredential'
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs, singleClaimCredentialJSON } from '../data/credential/credential'
import { testPrivateIdentityKey } from '../data/keys'

describe.only('Identity', () => {
  let clock
  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  it('should correctly instantiate Identity class', async () => {
    const credential = Credential.create(claimsMetadata.emailAddress, singleClaimCreationArgs)
    const sigCred = SignedCredential.fromCredential(credential)
    await sigCred.generateSignature(testPrivateIdentityKey)
  })

  it('should return a public profile verifiable credential on publicProfile.get', () => {
    //
  })
})
