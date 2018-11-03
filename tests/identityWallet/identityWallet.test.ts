import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { DidDocument } from '../../ts/identity/didDocument'
import { Credential } from '../../ts/credentials/credential/credential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON, mockKeyId, mockDid } from '../data/didDocument'
import { IVaultedKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { mockNameCredCreationAttrs } from '../data/credential/credential'
import { JSONWebToken } from '../../ts/interactionFlows/JSONWebToken'
import { signedSimpleCredReqJWT } from '../data/interactionFlows/jsonWebToken'
import { simpleCredRequestJSON } from '../data/interactionFlows/credentialRequest'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest'

chai.use(sinonChai)
const expect = chai.expect

/* Saves some space during stubbing, helper functions */

const stubbedKeyProvider = {
  signDigestable: sinon.stub().callsFake(attributes => Buffer.from(signedSimpleCredReqJWT.signature, 'hex'))
} as IVaultedKeyProvider

const stubbedFromJWTEncodable = args => {
  const jwt = new JSONWebToken()
  jwt.setTokenContent(args)
  return jwt
}

const stubbedCredential = {
  setSignatureValue: value => {
    expect(value).to.eq(signedSimpleCredReqJWT.signature)
  }
}

describe('IdentityWallet', () => {
  const encryptionPass = 'secret'
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })

  let iw: IdentityWallet

  describe('constructor', () => {
    it('Should correctly initialize', () => {
      iw = new IdentityWallet({
        identity,
        vaultedKeyProvider: stubbedKeyProvider,
        publicKeyMetadata: {
          derivationPath: KeyTypes.jolocomIdentityKey,
          keyId: mockKeyId
        }
      })

      expect(iw.getDid()).to.eq(mockDid)
    })
  })

  describe('create', () => {
    const sandbox = sinon.createSandbox()
    let stubCredCreate
    let stubFromJWTEncodable

    before(() => {
      stubCredCreate = sandbox.stub(SignedCredential, 'create').callsFake(() => stubbedCredential)
      stubFromJWTEncodable = sandbox.stub(JSONWebToken, 'fromJWTEncodable').callsFake(stubbedFromJWTEncodable)
    })

    afterEach(() => {
      sandbox.resetHistory()
    })

    after(() => {
      sandbox.restore()
    })

    it('Should expose aggregated creation methods', () => {
      const categories = ['credential', 'signedCredential', 'interactionTokens']
      const flowTypes = ['request', 'response']
      const tokenTypes = ['auth', 'offer', 'share']

      expect(Object.keys(iw.create)).to.deep.eq(categories)
      expect(Object.keys(iw.create.interactionTokens)).to.deep.eq(flowTypes)
      expect(Object.keys(iw.create.interactionTokens.request)).to.deep.eq(tokenTypes)
      expect(Object.keys(iw.create.interactionTokens.response)).to.deep.eq(tokenTypes)
    })

    it('Should attempt to create credential', () => {
      expect(iw.create.credential).to.eq(Credential.create)
    })

    it('Should attempt to create signedCredential', async () => {
      await iw.create.signedCredential(mockNameCredCreationAttrs, encryptionPass)

      sandbox.assert.calledOnce(stubCredCreate)
      sandbox.assert.calledWith(stubCredCreate, mockNameCredCreationAttrs)
    })

    /* All interaction tokens follow the same flow. Would still be good to cover all cases in the future. */

    it('Should attempt to create an interaction token', async () => {
      await iw.create.interactionTokens.request.share(simpleCredRequestJSON, encryptionPass)
      sandbox.assert.calledOnce(stubFromJWTEncodable)
      sandbox.assert.calledWith(stubFromJWTEncodable, CredentialRequest.fromJSON(simpleCredRequestJSON))
    })
  })
})
