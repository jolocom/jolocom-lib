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
  validSignature,
  validSignedCredReqJWT,
  validSignedCredResJWT,
  invalidNonce,
  validNonce,
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

  before(() => {
    sinon.useFakeTimers()
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

  after(() => {
    sandbox.restore()
  })

  it('Should sucessfully perform necessary validation steps on received jwt', async () => {
    try {
      await iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT))
    } catch (err) {
      expect(false).to.be.true
    }
  })

  it('Should throw error on invalid signature', async () => {
    validSignedCredReqJWT.signature = invalidSignature
    try {
      await iw.validateJWT(JSONWebToken.fromJSON(validSignedCredReqJWT))
    } catch (err) {
      validSignedCredReqJWT.signature = validSignature
      expect(err.message).to.eq('Signature on token is invalid')
    }
  })

  it('Should thow error on invalid nonce', async () => {
    validSignedCredReqJWT.payload.jti = invalidNonce
    try {
      await iw.validateJWT(
        JSONWebToken.fromJSON(validSignedCredResJWT),
        JSONWebToken.fromJSON(validSignedCredReqJWT),
      )
    } catch (err) {
      validSignedCredReqJWT.payload.jti = validNonce
      expect(err.message).to.eq('The token nonce deviates from request')
    }
  })
})
