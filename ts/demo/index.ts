import { JolocomLib, CredentialVerifier } from '../'
import { randomBytes } from 'crypto'
import { case1 } from './case1'
import { case2 } from './case2'
import { case3 } from './case3'

const runTests = async () => {
  const PASS = 'pass'

  const localDidMethod = JolocomLib.didMethods.jun

  const { identityWallet: alice } = await localDidMethod.recoverFromSeed(
    Buffer.from(randomBytes(32).toString('hex'), 'hex'),
    PASS
  )

  const { identityWallet: bob } = await localDidMethod.recoverFromSeed(
    Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
    PASS
  )

  const verifier = new CredentialVerifier([alice, bob])

  console.log(
    'Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable.'
  )
  await case1(alice, PASS, verifier)

  console.log(
    'Case 2. A VC without proofs is received as JSON. Two proofs are added. All signatures are verifiable.'
  )
  await case2(bob, PASS, verifier)

  console.log(
    'Case 3. A VC with existing proofs is received as JSON, new signature is added, the VC is tampered with, verification should fail'
  )
  await case3(bob, PASS, verifier)
}

runTests()
