import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  mockKeyId,
  mockIssuerDid,
  emailVerifiableCredential,
  emailVerifiableCredentialHash
} from '../data/credential/signedCredential.data'
import { EmailClaimMetadata } from 'cred-types-jolocom-core/js/types'
import { Credential } from '../../ts/credentials/credential/credential'
import { mockEmailCredCreationAttrs } from '../data/credential/credential.data'
import { expect } from 'chai'
import * as crypto from 'crypto'

chai.use(sinonChai)

describe('SignedCredential', () => {
  const sandbox = sinon.createSandbox()
  let create
  let clock
  let vCred: SignedCredential

  before(async () => {
    create = sandbox.spy(Credential, 'create')
    sandbox.stub(Math, 'random').returns(0.3378666668190271)
    sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('1842fb5f567dd532', 'hex'))

    clock = sinon.useFakeTimers()
    vCred = vCred = await SignedCredential.create<EmailClaimMetadata>(mockEmailCredCreationAttrs, {
      keyId: mockKeyId,
      issuerDid: mockIssuerDid
    })
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  describe('static create method', () => {
    it('Should correctly reference Credential construction', async () => {
      sandbox.assert.calledWith(create, mockEmailCredCreationAttrs)
    })

    it('Should correctly assemble signature on create', async () => {
      expect(vCred.proof.toJSON()).to.deep.eq(emailVerifiableCredential.proof)
    })
  })

  it('Should correctly implement toJSON method', () => {
    expect(vCred.toJSON()).to.deep.eq(emailVerifiableCredential)
  })

  it('Should correctly implement fromJSON method', () => {
    const fromJson = SignedCredential.fromJSON(emailVerifiableCredential)
    expect(fromJson).to.deep.eq(vCred)
  })

  it('Should produce expected digest', async () => {
    const normalized = (await vCred.digest()).toString('hex')
    expect(normalized).to.eq(emailVerifiableCredentialHash)
  })

  describe('Getters', () => {
    const { id, issued, issuer, expires, claim, proof, type } = emailVerifiableCredential
    it('Implements all getters', () => {
      expect(vCred.id).to.eq(id)
      expect(vCred.issued.toISOString()).to.eq(issued)
      expect(vCred.type).to.deep.eq(type)
      expect(vCred.issuer).to.eq(issuer)
      expect(vCred.signatureValue).to.deep.eq(proof.signatureValue)
      expect(vCred.expires.toISOString()).to.deep.eq(expires)
      expect(vCred.proof.toJSON()).to.deep.eq(proof)
      expect(vCred.subject).to.eq(claim.id)
      expect(vCred.claim).to.deep.eq(claim)
      expect(vCred.name).to.eq('Email address')
      expect(vCred.signer).to.deep.eq({
        did: issuer,
        keyId: proof.creator
      })
    })
  })
})
