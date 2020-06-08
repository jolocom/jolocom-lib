import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import * as joloDidResolver from 'jolo-did-resolver'
import { didDocumentJSON, mockKeyId } from '../data/didDocument.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import {
  validSignedCredReqJWT, invalidSignature, validSignedCredResJWT, invalidNonce,
} from '../data/interactionTokens/jsonWebToken.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { jolocomContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { jolocomContractsGateway } from '../../ts/contracts/contractsGateway'
import { ErrorCodes } from '../../ts/errors'
import { expect } from 'chai'

chai.use(sinonChai)

describe('IdentityWallet validate JWT', () => {
  const sandbox = sinon.createSandbox()
  const encryptionPass = 'secret'
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })
  const vault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)

  let iw: IdentityWallet
  let clock

  beforeEach(() => {
    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: sinon.stub().resolves(didDocumentJSON)
      })
  })

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    iw = new IdentityWallet({
      identity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: mockKeyId,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('Should sucessfully perform necessary validation steps on received jwt', () => {
    return iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT))
  })

  it('Should throw error on invalid signature', async () => {
    const tokenWithInvalidSignature = {
      ...validSignedCredReqJWT,
      signature: invalidSignature,
    }
    try {
      await iw.validateJWT(JSONWebToken.fromJSON(tokenWithInvalidSignature))
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWInvalidJWTSignature)
    }
  })

  it('Should throw error if token is expired', async () => {
    clock.tick(validSignedCredReqJWT.payload.exp + 1)

    try {
      await iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT))
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
    sandbox.stub(SoftwareKeyProvider, 'verifyDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(tokenWIthInvalidNonce),
        JSONWebToken.fromJSON(validSignedCredReqJWT),
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
    sandbox.stub(SoftwareKeyProvider, 'verifyDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(tokenWIthInvalidAud),
        JSONWebToken.fromJSON(validSignedCredReqJWT),
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
    sandbox.stub(SoftwareKeyProvider, 'verifyDigestable').resolves(true)
return iw.validateJWT(
      JSONWebToken.fromJSON(requestWithNoAud)
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
    sandbox.stub(SoftwareKeyProvider, 'verifyDigestable').resolves(true)

    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(requestWithInvalidAud)
      )
      expect(false).to.eq(true)
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.IDWNotIntendedAudience)
    }
  })
})
