import { expect } from 'chai'
import { deriveMasterKeyPairFromSeedPhrase, deriveGenericSigningKeyPair, deriveEthereumKeyPair } from '../ts/identity/key-derivation.ts'
import testData from './data/key-data'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'


describe('deriveMasterKeyPairFromSeedPhrase', () => {
  it('Should correctly derive a master key pair given a seedphrase', () => {
    const seedphrase = testData.testSeedPhrase
    const result = deriveMasterKeyPairFromSeedPhrase(seedphrase)
    expect(JSON.stringify(result)).to.equal(testData.testMasterKeyPairString)
  })
})


describe('deriveGenericSigningKeyPair', () => {
  it('Should correctly derive a generic signing key from a master key pair', () => {
    const masterKeyPair = new bitcoin.HDNode.fromSeedBuffer(testData.testSeed)
    const result =  deriveGenericSigningKeyPair(masterKeyPair)
    expect(JSON.stringify(result)).to.equal(testData.testGenericKeyPairString) })
})


describe('deriveEthereumKeyPair', () => {
  it('Should correctly derive an Ethereum key pair from a master key pair', () => {
    const masterKeyPair = new bitcoin.HDNode.fromSeedBuffer(testData.testSeed)
    const result =  deriveEthereumKeyPair(masterKeyPair)
    expect(JSON.stringify(result)).to.equal(testData.testEthereumKeyPairString)
  })
})
