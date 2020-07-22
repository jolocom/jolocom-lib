import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON, mockKeyId } from '../data/didDocument.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import {
  invalidSignature,
  validSignedCredReqJWT,
  invalidNonce,
  validSignedCredResJWT,
} from '../data/interactionTokens/jsonWebToken.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { jolocomContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { jolocomContractsGateway } from '../../ts/contracts/contractsGateway'
import { ErrorCodes } from '../../ts/errors'
chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet validate JWT', () => {
  const sandbox = sinon.createSandbox()
  const encryptionPass = 'secret'
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })
  const vault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)
  let iw: IdentityWallet
  let clock

  async function checkJWTSignature(label, jwt) {
    try {
      await iw.validateJWT(jwt)
    } catch (err) {
      console.error('checkJWTSignature error', err)
      if (err.message === ErrorCodes.IDWInvalidJWTSignature) {
        const newJWT = JSONWebToken.fromJSON(jwt.toJSON())
        const sigBuf = await vault.signDigestable(
          {
            derivationPath: KeyTypes.jolocomIdentityKey,
            encryptionPass,
          },
          newJWT,
        )
        const sig = sigBuf.toString('hex')
        newJWT.signature = sig
        console.error(
          'signature for ' + label + ' has changed!',
          '\nold value:',
          jwt.signature,
          '\nnew value:',
          sig,
          '\nencodes to\n',
          newJWT.encode(),
        )
      }
    }
  }

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    sandbox
      .stub(JolocomRegistry.prototype, 'resolve')
      .resolves(Identity.fromDidDocument({ didDocument }))

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

  it('Should sucessfully perform necessary validation steps on received jwt', async () => {
    const jwt = JSONWebToken.fromJSON(validSignedCredReqJWT)
    await checkJWTSignature('jsonWebToken.data.ts:validSignedCredReqJWT', jwt)
    await iw.validateJWT(jwt)
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
