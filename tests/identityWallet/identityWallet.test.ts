import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Credential } from '../../ts/credentials/credential/credential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON, mockKeyId, mockDid } from '../data/didDocument.data'
import { mockNameCredCreationAttrs } from '../data/credential/credential.data'
import { simpleCredRequestJSON } from '../data/interactionTokens/credentialRequest.data'
import { credentialResponseJSON } from '../data/interactionTokens/credentialResponse.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'
import { keyIdToDid } from '../../ts/utils/helper'
import { ErrorCodes } from '../../ts/errors'
import { IVaultedKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'
import { emailVerifiableCredential } from '../data/credential/signedCredential.data'

chai.use(sinonChai)
const expect = chai.expect

/* Saves some space during stubbing, helper functions */

//@ts-ignore Stubbed implementation
const stubbedKeyProvider = {
  sign: sinon.stub().resolves(Buffer.from('aaaa', 'hex')),
} as IVaultedKeyProvider

describe('IdentityWallet', () => {
  const encryptionPass = 'secret'
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })

  let iw: IdentityWallet

  // TODO Not sure this is a useful test
  describe('constructor', () => {
    it('Should correctly initialize', () => {
      iw = new IdentityWallet({
        identity,
        vaultedKeyProvider: stubbedKeyProvider,
        publicKeyMetadata: {
          signingKey: {
            keyId: mockKeyId,
            type: KeyTypes.ecdsaSecp256k1RecoveryMethod2020, // TODO Handle this
          },
          encryptionKey: {
            keyId: mockKeyId,
            type: KeyTypes.x25519KeyAgreementKey2019,
          },
        },
      })

      expect(iw.did).to.eq(mockDid)
    })
  })

  describe('create', () => {
    const sandbox = sinon.createSandbox({
      useFakeTimers: false,
    })

    let stubCredCreate
    let spyFromJWTEncodable
    let interactionToken

    before(() => {
      stubCredCreate = sandbox
        .stub(SignedCredential, 'create')
        .resolves(SignedCredential.fromJSON(emailVerifiableCredential))

      spyFromJWTEncodable = sandbox.spy(JSONWebToken, 'fromJWTEncodable')
    })

    afterEach(() => {
      sandbox.resetHistory()
    })

    after(() => {
      sandbox.restore()
    })

    it('Should expose aggregated creation methods', () => {
      const categories = [
        'credential',
        'signedCredential',
        'message',
        'interactionTokens',
      ]
      const flowTypes = ['request', 'response']
      const tokenTypesRequest = ['auth', 'offer', 'share']
      const tokenTypesResponse = ['auth', 'offer', 'share', 'issue']

      expect(Object.keys(iw.create)).to.deep.eq(categories)
      expect(Object.keys(iw.create.interactionTokens)).to.deep.eq(flowTypes)
      expect(Object.keys(iw.create.interactionTokens.request)).to.deep.eq(
        tokenTypesRequest,
      )
      expect(Object.keys(iw.create.interactionTokens.response)).to.deep.eq(
        tokenTypesResponse,
      )
    })

    /* A bit hacky, but deep eq for functions is tricky. Should work most of the time */
    it('Should call Credential.create on wi.create.credential', () => {
      expect(iw.create.credential.toString()).to.eq(
        Credential.create.toString(),
      )
    })

    it('Should attempt to create signedCredential', async () => {
      const cred = await iw.create.signedCredential(
        mockNameCredCreationAttrs,
        encryptionPass,
      )

      sandbox.assert.calledOnce(stubCredCreate)
      sandbox.assert.calledWith(stubCredCreate, mockNameCredCreationAttrs)
    })

    /* All interaction tokens follow the same flow. Would still be good to cover all cases in the future. */

    it('Should attempt to create an interaction token', async () => {
      interactionToken = await iw.create.interactionTokens.request.share(
        simpleCredRequestJSON,
        encryptionPass,
      )

      sandbox.assert.calledOnce(spyFromJWTEncodable)
      sandbox.assert.calledWith(
        spyFromJWTEncodable,
        CredentialRequest.fromJSON(simpleCredRequestJSON),
      )
      const expectedExpiry = 60 * 60 * 1000
      expect(interactionToken.expires - interactionToken.issued).to.eq(
        expectedExpiry,
      )
    })

    it('Should attempt to create an interaction token with custom expiry time', async () => {
      const customExpiry = new Date(2030, 1, 1)
      const interactionTokenCustomExpiry = await iw.create.interactionTokens.request.share(
        {
          ...simpleCredRequestJSON,
          expires: customExpiry,
        },
        encryptionPass,
      )

      sandbox.assert.calledOnce(spyFromJWTEncodable)
      sandbox.assert.calledWith(
        spyFromJWTEncodable,
        CredentialRequest.fromJSON(simpleCredRequestJSON),
      )
      expect(interactionTokenCustomExpiry.expires).to.eq(customExpiry.getTime())
    })

    it('Should fail to create an interaction token with invalid expiry time', async () => {
      const customExpiry = new Date(0)
      return iw.create.interactionTokens.request
        .share(
          {
            ...simpleCredRequestJSON,
            expires: customExpiry,
          },
          encryptionPass,
        )
        .then(() => {
          throw new Error('Expected Failure')
        })
        .catch(err => {
          expect(err.message).to.contain(ErrorCodes.JWTInvalidExpiryDate)
        })
    })

    it('Should create an interaction token as a response', async () => {
      const decodedToken = JSONWebToken.decode<CredentialRequest>(
        interactionToken.encode(),
      )
      const interactionResponeToken = await iw.create.interactionTokens.response.share(
        credentialResponseJSON,
        encryptionPass,
        decodedToken,
      )

      expect(interactionResponeToken.nonce).to.eq(decodedToken.nonce)
      expect(interactionResponeToken.audience).to.eq(
        keyIdToDid(decodedToken.issuer),
      )
    })
  })
})
