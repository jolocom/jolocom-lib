import * as sinon from 'sinon'
import {
  JolocomRegistry,
  createJolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON } from '../data/didDocument.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import {
  testPrivateIdentityKey,
  testPublicIdentityKey,
  testSeed,
} from '../data/keys.data'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { msgSignature } from '../data/keyProvider.data'
import { encryptionPass, keyMetadata } from './jolocomRegistry.data'

describe('Jolocom Registry - create', () => {
  const sandbox = sinon.createSandbox()

  let identityWallet: IdentityWallet
  const mockVault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)

  before(async () => {
    sandbox.stub(mockVault, 'getPublicKey').returns(testPublicIdentityKey)
    sandbox.stub(mockVault, 'getPrivateKey').returns(testPrivateIdentityKey)

    sandbox.stub(JolocomRegistry.prototype, 'commit').resolves()
    sandbox
      .stub(DidDocument, 'fromPublicKey')
      .returns(DidDocument.fromJSON(didDocumentJSON))
    sandbox.stub(Identity, 'fromDidDocument').returns(new Identity())
  })

  after(() => {
    sandbox.restore()
  })

  it('should create new identity', async () => {
    const jolocomRegistry = createJolocomRegistry()

    const expectedDidDoc = Object.assign({}, didDocumentJSON)

    identityWallet = await jolocomRegistry.create(mockVault, encryptionPass)

    sandbox.assert.calledWith(mockVault.getPublicKey, keyMetadata)
    sandbox.assert.calledWith(Identity.fromDidDocument, {
      didDocument: DidDocument.fromJSON(expectedDidDoc),
    })
    sandbox.assert.calledWith(JolocomRegistry.prototype.commit, {
      identityWallet: identityWallet,
      keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
      vaultedKeyProvider: mockVault,
    })
  })
})
