import * as chai from 'chai'
import { SignedCredential } from '../../ts/credentials/outdated/signedCredential'
import {
  emailVerifiableCredential,
  emailVerifiableCredentialHash,
  example1,
} from '../data/credential/signedCredential.data'
import { expect } from 'chai'

chai.use(require("sinon-chai"))

describe.only('SignedCredential, version 1.1. data model compliance', () => {
  let vCred: SignedCredential

  it('Should correctly implement fromJSON method', () => {
    //@ts-ignore TODO #1 PROTOCOL TS CHANGES, LINK LOCAL, TEST, PUBLISH
    console.log(SignedCredential.fromJSON(example1))
    const fromJson = SignedCredential.fromJSON(emailVerifiableCredential)
    vCred = fromJson
    expect(fromJson).to.deep.eq(vCred)
  })

  it('Should correctly implement toJSON method', () => {
    expect(vCred.toJSON()).to.deep.eq(emailVerifiableCredential)
  })

  it('Should produce expected digest', async () => {
    const normalized = (await vCred.digest()).toString('hex')
    expect(normalized).to.eq(emailVerifiableCredentialHash)
  })

  describe('Getters', () => {
    const {
      id,
      issued,
      issuer,
      expires,
      claim,
      proof,
      type,
    } = emailVerifiableCredential
    it('Implements all getters', () => {
      expect(vCred.id).to.eq(id)
      expect(vCred.issued.toISOString()).to.eq(issued)
      expect(vCred.type).to.deep.eq(type)
      expect(vCred.issuer).to.eq(issuer)
      expect(vCred.signature).to.deep.eq(proof.signatureValue)
      expect(vCred.expires.toISOString()).to.deep.eq(expires)
      expect(vCred.proof.toJSON()).to.deep.eq(proof)
      expect(vCred.subject).to.eq(claim.id)
      expect(vCred.claim).to.deep.eq(claim)
      expect(vCred.name).to.eq('Email address')
      expect(vCred.signer).to.deep.eq({
        did: issuer,
        keyId: proof.creator,
      })
    })
  })
})
