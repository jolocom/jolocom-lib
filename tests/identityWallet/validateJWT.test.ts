import * as chai from 'chai'
import * as sinon from 'sinon'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON, mockKeyId } from '../data/didDocument.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import {
  validSignedCredReqJWT, invalidSignature, validSignedCredResJWT, invalidNonce,
} from '../data/interactionTokens/jsonWebToken.data'
import { ErrorCodes } from '../../ts/errors'
import { expect } from 'chai'
import { JolocomResolver } from '../../ts/didMethods/jolo/resolver'
import { IVaultedKeyProvider } from '@jolocom/vaulted-key-provider'
import * as validationUtils from '../../ts/utils/validation'

chai.use(require("sinon-chai"))

describe('IdentityWallet validate JWT', () => {
  const sandbox = sinon.createSandbox()
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })
  const vault = {} as IVaultedKeyProvider

  let iw: IdentityWallet
  let clock

  const testResolver = new JolocomResolver()
  testResolver.resolve = async _ =>
    Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDocumentJSON),
    })

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    iw = new IdentityWallet({
      identity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        signingKeyId: mockKeyId,
        encryptionKeyId: mockKeyId,
      },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('Should sucessfully perform necessary validation steps on received jwt', () => {
    return iw.validateJWT(
      JSONWebToken.fromJSON(validSignedCredReqJWT),
      undefined,
      testResolver,
    )
  })

  it('Should throw error on invalid signature', async () => {
    const tokenWithInvalidSignature = {
      ...validSignedCredReqJWT,
      signature: invalidSignature,
    }
    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(tokenWithInvalidSignature),
        undefined,
        testResolver,
      )
      expect(false).to.eq(true)
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWInvalidJWTSignature)
    }
  })

  it('Should throw error if token is expired', async () => {
    clock.tick(validSignedCredReqJWT.payload.exp + 1)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(validSignedCredReqJWT),
        undefined,
        testResolver,
      )
      expect(true).to.eq(false)
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWTokenExpired)
    }
  })

  it('Should throw error on invalid nonce', async () => {
    const tokenWIthInvalidNonce = {
      ...validSignedCredResJWT,
      payload: {
        ...validSignedCredResJWT.payload,
        nonce: invalidNonce,
      },
    }

    /** @dev Restored in afterEach */
    sandbox.stub(validationUtils, 'validateDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(tokenWIthInvalidNonce),
        JSONWebToken.fromJSON(validSignedCredReqJWT),
        testResolver,
      )
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWIncorrectJWTNonce)
    }
  })

  it('Should throw error if the aud on response is not correct', async () => {
    const tokenWIthInvalidAud = {
      ...validSignedCredResJWT,
      payload: {
        ...validSignedCredReqJWT.payload,
        aud: 'did:jolo:ff',
      },
    }

    /** @dev Restored in afterEach */
    sandbox.stub(validationUtils, 'validateDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(tokenWIthInvalidAud),
        JSONWebToken.fromJSON(validSignedCredReqJWT),
        testResolver,
      )
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWNotCorrectResponder)
    }
  })

  it('Should not throw error if the aud on a request is not defined', async () => {
    const requestWithNoAud = {
      ...validSignedCredReqJWT,
      payload: {
        ...validSignedCredReqJWT.payload,
        aud: '',
      },
    }

    /** @dev Restored in afterEach */
    sandbox.stub(validationUtils, 'validateDigestable').resolves(true)
return iw.validateJWT(
  JSONWebToken.fromJSON(requestWithNoAud),
  undefined,
  testResolver,
)
  })

  it('Should throw error if the aud on a request is defined and does not match current identity', async () => {
    const requestWithInvalidAud = {
      ...validSignedCredReqJWT,
      payload: {
        ...validSignedCredReqJWT.payload,
        aud: 'did:jolo:ff',
      },
    }
    /** @dev Restored in afterEach */
    sandbox.stub(validationUtils, 'validateDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(requestWithInvalidAud),
        undefined,
        testResolver,
      )
      expect(false).to.eq(true)
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWNotIntendedAudience)
    }
  })
})
