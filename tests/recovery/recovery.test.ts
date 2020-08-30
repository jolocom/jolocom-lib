import { expect } from 'chai'
import {
  testDID16,
  testDID32,
  testSeedPhrase16,
  testSeedPhrase32,
  testSeedPhraseWithDid16,
  testSeedPhraseWithDid32,
  testShares,
  testSecret32,
  testSecret16
} from '../data/recovery.data'
import { sliceSeedPhrase, shardsToMnemonic } from '../../ts/recovery/recovery'

describe('Utility Recovery functions', () => {

  it('should recover ', async () => {
    expect(sliceSeedPhrase(testSeedPhrase16)).to.deep.eq({
      encodedDid: 0,
      seed: testSecret16
    })


    expect(sliceSeedPhrase(testSeedPhrase32)).to.deep.eq({
      encodedDid: 0,
      seed: testSecret32
    })

    expect(sliceSeedPhrase(testSeedPhraseWithDid16)).to.deep.eq({
      encodedDid: testDID16.replace('did:jolo:', ''),
      seed: testSecret16
    })

    expect(sliceSeedPhrase(testSeedPhraseWithDid32)).to.deep.eq({
      encodedDid: testDID32.replace('did:jolo:', ''),
      seed: testSecret32
    })
  })

  it('should recover from shards', async () => {
    const {didPhrase, seed} = await shardsToMnemonic(testShares)

    expect(`${seed} ${didPhrase}`).to.eq(testSeedPhraseWithDid32)
  })
})
