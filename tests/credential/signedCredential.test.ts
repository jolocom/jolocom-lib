import * as chai from 'chai'
import * as sinon from 'sinon'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  mockKeyId,
  mockIssuerDid,
  emailVerifiableCredential,
  emailVerifiableCredentialHash,
} from '../data/credential/signedCredential.data'
import { EmailClaimMetadata } from '@jolocom/protocol-ts'
import { Credential } from '../../ts/credentials/credential/credential'
import { mockEmailCredCreationAttrs } from '../data/credential/credential.data'
import { expect } from 'chai'
import *  as crypto from '../../ts/utils/crypto'
import *  as nodeCrypto from 'crypto'
import { ErrorCodes } from '../../ts/errors'

chai.use(require('sinon-chai'))

describe('SignedCredential', () => {
  const sandbox = sinon.createSandbox()
  let credentialCreate
  let clock
  let vCred: SignedCredential

  before(async () => {
    credentialCreate = sandbox.spy(Credential, 'create')
    // This sets the nonce on the proof
    sandbox
      .stub(crypto, 'getRandomBytes')
      .resolves(Buffer.from('1842fb5f567dd532', 'hex'))

    // This sets the claimId
    sandbox
      .stub(nodeCrypto, 'randomBytes')
      //@ts-ignore TS complains. It thinks the return of randomBytes is void.
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))

    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  beforeEach(async () => {
    vCred = vCred = await SignedCredential.create<EmailClaimMetadata>(
      mockEmailCredCreationAttrs,
      {
        keyId: mockKeyId,
        issuerDid: mockIssuerDid,
      },
    )
  })

  afterEach(() => {
    sandbox.resetHistory()
  })

  describe('static create method', () => {
    it('Should correctly set the default expiry date', () => {
      // Because of mock timers, Date.now() returns unix time 0
      expect(vCred.expires.getFullYear()).to.deep.eq(1971)
    })

    it('Should correctly set custom expiry date', async () => {
      const customExpiry = new Date(2030, 1, 1)
      const vCredCustomExpiry = await SignedCredential.create(
        { ...mockEmailCredCreationAttrs },
        {
          keyId: mockKeyId,
          issuerDid: mockIssuerDid,
        },
        customExpiry,
      )
      expect(vCredCustomExpiry.expires).to.deep.eq(customExpiry)
      sandbox.assert.calledWith(credentialCreate, mockEmailCredCreationAttrs)
    })

    it('Should fail to create if custom expiry date is in the past', async () => {
      const customExpiry = new Date(1360, 1, 1)
      return SignedCredential.create(
        { ...mockEmailCredCreationAttrs },
        {
          keyId: mockKeyId,
          issuerDid: mockIssuerDid,
        },
        customExpiry,
      )
        .then(() => {
          throw new Error('Expected failure')
        })
        .catch(err => {
          expect(err.message).to.contain(ErrorCodes.VCInvalidExpiryDate)
        })
    })

    it('Should correctly reference Credential construction', async () => {
      sandbox.assert.calledWith(credentialCreate, mockEmailCredCreationAttrs)
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
