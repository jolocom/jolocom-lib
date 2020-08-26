import {
  joloMnemonicToEncryptedWallet
} from '../../ts/recovery/recovery'
import { expect } from 'chai'
import {
  testDID16,
  testDID32,
  testSeedPhrase16,
  testSeedPhrase32,
  testSeedPhraseWithDid16,
  testSeedPhraseWithDid32,
  testShares,
} from '../data/recovery.data'
import { walletUtils } from '@jolocom/native-core'
import * as sinon from 'sinon'

describe('Recovery', () => {
  const pass = 'secret'

  it('should recover from a short seed phrase 12 words', async () => {
    const keyProvider = await joloMnemonicToEncryptedWallet(
      testSeedPhrase16,
      pass,
      walletUtils,
    )

    expect(keyProvider.id).to.eq(testDID16)
    expect(await keyProvider.getPubKeys(pass)).length(3)
  })

  it('should recover from a short seed phrase 24 words', async () => {
    const keyProvider = await joloMnemonicToEncryptedWallet(
      testSeedPhrase32,
      pass,
      walletUtils,
    )

    expect(keyProvider.id).to.eq(testDID32)
    expect(await keyProvider.getPubKeys(pass)).length(3)
  })

  it('should recover from a long seed phrase 24 words', async () => {
    const keyProvider = await joloMnemonicToEncryptedWallet(
      testSeedPhrase32,
      pass,
      walletUtils,
    )

    expect(keyProvider.id).to.eq(testDID32)
    expect(await keyProvider.getPubKeys(pass)).length(3)
  })

  it('should recover from a long seed phrase 12 words', async () => {
    const keyProvider = await joloMnemonicToEncryptedWallet(
      testSeedPhraseWithDid16,
      pass,
      walletUtils,
    )

    expect(keyProvider.id).to.eq(testDID16)
    expect(await keyProvider.getPubKeys(pass)).length(3)
  })

  it('should recover from a long seed phrase 12 words', async () => {
    const keyProvider = await joloMnemonicToEncryptedWallet(
      testSeedPhraseWithDid32,
      pass,
      walletUtils,
    )

    expect(keyProvider.id).to.eq(testDID32)
    expect(await keyProvider.getPubKeys(pass)).length(3)
  })


  it('should recover from shards', async () => {
//    const identityWallet = await recoverFromShards(
//      resolver,
//      testShares,
//      {
//        keyRef: '',
//        encryptionPass: pass
//      },
//    )
//    sandbox.assert.calledWith(JolocomResolver.prototype.resolve, testDID32)
//    expect(identityWallet['_vaultedKeyProvider']).to.deep.eq(referenceVault32)
   })
})
