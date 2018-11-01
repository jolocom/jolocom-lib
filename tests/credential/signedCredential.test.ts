import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  testSignedCredentialCreateArgs,
  mockKeyId,
  mockIssuerDid,
  emailVerifiableCredential,
  emailVerifiableCredentialHash
} from '../data/credential/signedCredential'
import { EmailClaimMetadata } from 'cred-types-jolocom-core/js/types'
import { Credential } from '../../ts/credentials/credential/credential'
import { mockEmailCredCreationAttrs } from '../data/credential/credential'
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
    vCred = vCred = await SignedCredential.create<EmailClaimMetadata>({
      keyId: mockKeyId,
      issuerDid: mockIssuerDid,
      ...mockEmailCredCreationAttrs
    })
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  describe('static create method', () => {
    it('Should correctly reference Credential construction', async () => {
      sandbox.assert.calledWith(create, testSignedCredentialCreateArgs)
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

  it('Should produce expected digest', async() => {
    const normalized = (await vCred.digest()).toString('hex')
    expect(normalized).to.eq(emailVerifiableCredentialHash)
  })
})
