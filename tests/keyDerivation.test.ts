import { expect } from 'chai'
import testData from './data/keys'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import {
  deriveMasterKeyPairFromSeedPhrase,
  deriveGenericSigningKeyPair,
  deriveEthereumKeyPair 
} from '../ts/identity/keyDerivation'

describe('deriveMasterKeyPairFromSeedPhrase', () => {
  it('Should correctly derive a master key pair given a seedphrase', () => {
    const seedphrase = testData.testSeedPhrase
    const result = deriveMasterKeyPairFromSeedPhrase(seedphrase)
    const wif = result.keyPair.toWIF()
    expect(JSON.stringify(result)).to.equal(testData.testMasterKeyPairString)
    expect(wif).to.equal(testData.testMasterKeyPairWIF)
  })
})


describe('deriveGenericSigningKeyPair', () => {
  it('Should correctly derive a generic signing key from a master key pair', () => {
    const masterKeyPair = new bitcoin.HDNode.fromSeedBuffer(testData.testSeed)
    const result =  deriveGenericSigningKeyPair(masterKeyPair)
    const wif = result.keyPair.toWIF()
    expect(JSON.stringify(result)).to.equal(testData.testGenericKeyPairString)
    expect(wif).to.equal(testData.testGenericKeyPairWIF)
  })
})


describe('deriveEthereumKeyPair', () => {
  it('Should correctly derive an Ethereum key pair from a master key pair', () => {
    const masterKeyPair = new bitcoin.HDNode.fromSeedBuffer(testData.testSeed)
    const result =  deriveEthereumKeyPair(masterKeyPair)
    const wif = result.keyPair.toWIF()
    expect(JSON.stringify(result)).to.equal(testData.testEthereumKeyPairString)
    expect(wif).to.equal(testData.testEthereumKeyPairWIF)
  })
})
