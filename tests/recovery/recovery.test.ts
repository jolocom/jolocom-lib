import {
  recoverFromSeedPhrase,
  recoverFromShards,
} from '../../ts/recovery/recovery'
import { expect } from 'chai'
import { didDocumentJSON } from '../data/didDocument.data'
import * as sinon from 'sinon'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { keyDerivationArgs } from '../data/identityWallet.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import {
  testDID16,
  testDID32,
  testSecret16,
  testSecret32,
  testSeedPhrase16,
  testSeedPhrase32,
  testSeedPhraseWithDid16,
  testSeedPhraseWithDid32,
  testShares,
} from '../data/recovery.data'
import { JolocomResolver } from '../../ts/didMethods/jolo/resolver'

describe('Recovery', () => {
  const sandbox = sinon.createSandbox()
  const resolver = new JolocomResolver('', '', '')
  const mockDidDoc = DidDocument.fromJSON(didDocumentJSON)

  let referenceVault32, referenceVault16

  beforeEach(() => {
    sandbox
      .stub(JolocomResolver.prototype, 'resolve')
      .resolves(Identity.fromDidDocument({ didDocument: mockDidDoc }))

    sandbox
      .stub(SoftwareKeyProvider, 'getRandom')
      .returns(Buffer.from('12345678123456781234567812345678', 'hex'))

    referenceVault32 = SoftwareKeyProvider.fromSeed(
      Buffer.from(testSecret32, 'hex'),
      keyDerivationArgs.encryptionPass,
    )

    referenceVault16 = SoftwareKeyProvider.fromSeed(
      Buffer.from(testSecret16, 'hex'),
      keyDerivationArgs.encryptionPass,
    )
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should recover from a short seed phrase 12 words', async () => {
    const identityWallet = await recoverFromSeedPhrase(
      resolver,
      testSeedPhrase16,
      keyDerivationArgs,
    )

    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID16)
    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault16)
  })

  it('should recover from a short seed phrase 24 words', async () => {
    const identityWallet = await recoverFromSeedPhrase(
      resolver,
      testSeedPhrase32,
      keyDerivationArgs,
    )
    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID32)
    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault32)
  })

  it('should recover from a long seed phrase 24 words', async () => {
    const identityWallet = await recoverFromSeedPhrase(
      resolver,
      testSeedPhraseWithDid32,
      keyDerivationArgs,
    )
    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID32)
    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault32)
  })
  it('should recover from a long seed phrase 12 words', async () => {
    const identityWallet = await recoverFromSeedPhrase(
      resolver,
      testSeedPhraseWithDid16,
      keyDerivationArgs,
    )
    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID16)
    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault16)
  })

  it('should recover from shards', async () => {
    const identityWallet = await recoverFromShards(
      resolver,
      testShares,
      keyDerivationArgs,
    )
    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID32)
    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault32)
  })
})
