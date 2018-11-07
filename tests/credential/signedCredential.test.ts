import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  mockKeyId,
  mockIssuerDid,
  emailVerifiableCredential,
  emailVerifiableCredentialHash,
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
      issuerDid: mockIssuerDid,
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
      expect(vCred.getProofSection().toJSON()).to.deep.eq(emailVerifiableCredential.proof)
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
    it('Implements getId', () => {
      expect(vCred.getId()).to.eq(id)
    })
    it('Implements getIssued', () => {
      expect(vCred.getIssued().toISOString()).to.eq(issued)
    })
    it('Implements getType', () => {
      expect(vCred.getType()).to.deep.eq(type)
    })
    it('Implements getIssuer', () => {
      expect(vCred.getIssuer()).to.eq(issuer)
    })
    it('Implements getSignatureValue', () => {
      expect(vCred.getSignatureValue()).to.deep.eq(Buffer.from(proof.signatureValue))
    })
    it('Implements getSigner', () => {
      expect(vCred.getSigner()).to.deep.eq({
        did: issuer,
        keyId: proof.creator,
      })
    })
    it('Implements getExpiryDate', () => {
      expect(vCred.getExpiryDate().toISOString()).to.deep.eq(expires)
    })
    it('Implements getProofSection', () => {
      expect(vCred.getProofSection().toJSON()).to.deep.eq(proof)
    })
    it('Implements getSubject', () => {
      expect(vCred.getSubject()).to.eq(claim.id)
    })
    it('Implements getClaims', () => {
      expect(vCred.getClaims()).to.deep.eq(claim)
    })
    it('Implements getDisplayName', () => {
      expect(vCred.getDisplayName()).to.eq('Email address')
    })
  })
})
