import * as sinon from 'sinon'
import {
  JolocomRegistry,
  createJolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { Identity } from '../../ts/identity/identity'
import {
  didDocumentJSON,
  mockDid,
  mockKeyId,
  mockPublicKeyHex,
} from '../data/didDocument.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import {
  testPrivateIdentityKey,
  testPublicKey,
  testSeed,
} from '../data/keys.data'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { msgSignature } from '../data/keyProvider.data'
import { encryptionPass, keyMetadata } from './jolocomRegistry.data'
import { keyIdToNumber } from '../../ts/utils/helper'

describe('Jolocom Registry - create', () => {
  const sandbox = sinon.createSandbox()

  let identityWallet: IdentityWallet
  const mockVault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)

  before(async () => {
    sandbox.stub(mockVault, 'getPublicKey').returns(testPublicKey)
    sandbox.stub(mockVault, 'signDigestable').returns(msgSignature)
    sandbox.stub(mockVault, 'getPrivateKey').returns(testPrivateIdentityKey)

    sandbox.stub(JolocomRegistry.prototype, 'commit').resolves()
    sandbox
      .stub(DidDocument, 'fromPublicKey')
      .returns(DidDocument.fromJSON(didDocumentJSON))
    sandbox.stub(Identity, 'create').returns(
      new Identity(mockDid, {
        hexValue: mockPublicKeyHex,
        keyId: keyIdToNumber(mockKeyId),
      }),
    )
  })

  after(() => {
    sandbox.restore()
  })

  it('should create new identity', async () => {
    const jolocomRegistry = createJolocomRegistry()

    identityWallet = await jolocomRegistry.create(mockVault, encryptionPass)

    sandbox.assert.calledWith(mockVault.getPublicKey, keyMetadata)
    sandbox.assert.calledWith(
      Identity.create,
      Buffer.from(mockPublicKeyHex, 'hex'),
    )
    sandbox.assert.calledWith(JolocomRegistry.prototype.commit, {
      identityWallet: identityWallet,
      keyMetadata: keyMetadata,
      vaultedKeyProvider: mockVault,
    })
  })
})
