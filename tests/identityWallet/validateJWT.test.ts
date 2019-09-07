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

  it('Should sucessfully perform necessary validation steps on received jwt', done => {
    iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT)).then(
      done,
      done,
    )
  })

  it('Should throw error on invalid signature', async () => {
    const tokenWithInvalidSignature = {
      ...validSignedCredReqJWT,
      signature: invalidSignature,
    }
    try {
      await iw.validateJWT(JSONWebToken.fromJSON(tokenWithInvalidSignature))
    } catch (err) {
      expect(err.message).to.eq('Signature on token is invalid')
    }
  })

  it('Should throw error if token is expired', async () => {
    clock.tick(validSignedCredReqJWT.payload.exp + 1)

    try {
      await iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT))
      expect(true).to.eq(false)
    } catch (err) {
      expect(err.message).to.eq('Token expired')
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
      expect(err.message).to.eq('The token nonce deviates from request')
    }
  })

  it('Should throw error if the aud is not correct', async () => {
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
      expect(err.message).to.eq(
        'You are not the intended audience of received token',
      )
    }
  })
})
