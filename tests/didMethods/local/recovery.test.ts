import * as chai from 'chai'
import * as sinon from 'sinon'
import { slip10DeriveKey } from '../../../ts/didMethods/local/recovery'
import { LocalDidMethod } from '../../../ts/didMethods/local'

const expect = chai.expect

describe('Local Did Method, slip0010 recovery', async () => {
  it('Should correctly derive ed25519 keys using slip0010', () => {
    const testSeed = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex')
    // Test vectors from https://github.com/satoshilabs/slips/blob/master/slip-0010.md#test-vector-1-for-ed25519
    const testVectors = [
      [
        "m/0'",
        '68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3',
      ],
      [
        "m/0'/1'",
        'b1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2',
      ],
      [
        "m/0'/1'/2'",
        '92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9',
      ],
      [
        "m/0'/1'/2'/2'/1000000000'",
        '8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793',
      ],
    ]

    const derivationFn = slip10DeriveKey(testSeed)

    testVectors.forEach(([path, sKey]) =>
      expect(derivationFn(path)).to.deep.eq(Buffer.from(sKey, 'hex')),
    )
  })

  it('Should correctly derive keys / incept an identity given a seed', async () => {
    // The expected values are self generated, derived using slip0010, the testSeed, and jolocom specific paths
    const testSeed = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex')
    const {
      identityWallet,
      succesfullyResolved,
    } = await new LocalDidMethod().recoverFromSeed(testSeed, 'pass')
    // const recoveredIdentity = await recoverIdentityFromSlip0010Seed(testSeed, 'pass', walletUtils)
    expect(identityWallet.identity.did).to.eq(
      'did:jun:E9owvpwvhd59r32LMajuxqgTUZffqU9qxH4GN3jokf5s',
    )

    expect(identityWallet.identity.publicKeySection[0].toJSON()).to.deep.eq({
      controller: 'did:jun:E9owvpwvhd59r32LMajuxqgTUZffqU9qxH4GN3jokf5s',
      id: '#D2UI8qsT_W3L_zHZeMOJt2LzjK-Z2KhBrYKjGEW-q6d8',
      publicKeyHex:
        'd9423caac4ff5b72ffcc765e30e26dd8bce32be6762a106b60a8c6116faae9df',
      type: 'Ed25519VerificationKey2018',
    })

    expect(identityWallet.identity.publicKeySection[1].toJSON()).to.deep.eq({
      controller: 'did:jun:E9owvpwvhd59r32LMajuxqgTUZffqU9qxH4GN3jokf5s',
      id: '#CGUL0FEWtao96Bo6RUJ50xlV29x90jhibNly7fOTL_m8',
      publicKeyHex:
        '1942f41445ad6a8f7a068e91509e74c65576f71f748e189b365cbb7ce4cbfe6f',
      type: 'X25519KeyAgreementKey2019',
    })
  })
})
