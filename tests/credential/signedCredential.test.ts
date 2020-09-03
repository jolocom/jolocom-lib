import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import chaiExclude from 'chai-exclude'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  emailVerifiableCredential,
  unsignedEmailCredential,
} from '../data/credential/signedCredential.data'
import { EmailClaimMetadata } from '@jolocom/protocol-ts'
import {
  mockEmailCredCreationAttrs,
  emailCredentialJSON,
} from '../data/credential/credential.data'
import { expect } from 'chai'
import * as crypto from '../../ts/utils/crypto'
import { ErrorCodes } from '../../ts/errors'
import { LinkedDataSignature } from '../../ts/linkedDataSignature'

chai.use(sinonChai)
chai.use(chaiExclude)

describe('SignedCredential', () => {
  const sandbox = sinon.createSandbox()
  let clock

  before(async () => {
    // Sets the nonce on the proof
    sandbox
      .stub(crypto, 'getRandomBytes')
      .resolves(Buffer.from('1842fb5f567dd532', 'hex'))

    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  afterEach(() => {
    sandbox.resetHistory()
  })

  describe('static create method', () => {
    it('Should correctly set the default expiry date', async () => {
      // Because of mock timers, Date.now() returns unix time 0
      const vCred = await SignedCredential.create<EmailClaimMetadata>(
        mockEmailCredCreationAttrs,
      )

      expect(vCred.expires.getFullYear()).to.deep.eq(1971)
    })

    it('Should correctly set custom expiry date', async () => {
      const customExpiry = new Date(2030, 1, 1)
      const vCredCustomExpiry = await SignedCredential.create(
        { ...mockEmailCredCreationAttrs },
        customExpiry,
      )
      expect(vCredCustomExpiry.expires).to.deep.eq(customExpiry)
    })

    it('Should fail to create if custom expiry date is in the past', async () => {
      const customExpiry = new Date(1360, 1, 1)
      return SignedCredential.create(
        { ...mockEmailCredCreationAttrs },
        customExpiry,
      )
        .then(() => {
          throw new Error('Expected failure')
        })
        .catch(err => {
          expect(err.message).to.contain(ErrorCodes.VCInvalidExpiryDate)
        })
    })

    it('The proof section should not be populated upon creation', async () => {
      const vCred = await SignedCredential.create<EmailClaimMetadata>(
        mockEmailCredCreationAttrs,
      )

      expect(vCred.proof).to.deep.eq(new LinkedDataSignature())
    })
  })

  it('Should correctly implement toJSON method', async () => {
    const vCred = await SignedCredential.create<EmailClaimMetadata>(
      mockEmailCredCreationAttrs,
    )

    expect(vCred.toJSON())
      .excluding('id')
      .to.deep.eq(unsignedEmailCredential)
    expect(vCred.id).length(unsignedEmailCredential.id.length)
  })

  it('Should correctly implement fromJSON method', async () => {
    const vCred = await SignedCredential.create<EmailClaimMetadata>(
      mockEmailCredCreationAttrs,
    )

    const fromJson = SignedCredential.fromJSON(unsignedEmailCredential)
    expect(fromJson)
      .excluding(['_id', '_proof'])
      .to.deep.eq(vCred)
  })

  it('Should implement asBytes', async () => {
    const vCredBytes = await SignedCredential.fromJSON(
      emailVerifiableCredential,
    ).asBytes()
    expect(vCredBytes.toString('hex')).to.eq(
      '68627b65ac2d2dc06c00ea95887b461e112b2de1ca78bb2e8889b6405964b6431654a3c317096b714deeb8ac3d1ae4a4818963a8cd9889e88249d69cbcc9050a',
    )
  })
})

it('Implements all getters', async () => {
  const vCred = SignedCredential.fromJSON(emailVerifiableCredential)

  const {
    id,
    issued,
    issuer,
    expires,
    claim,
    proof,
    type,
  } = emailVerifiableCredential

  expect(vCred.id).length(id.length)
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
