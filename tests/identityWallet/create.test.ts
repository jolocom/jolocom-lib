import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { LocalDidMethod } from '../../ts/didMethods/local'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'

chai.use(sinonChai)
const expect = chai.expect

/* Saves some space during stubbing, helper functions */


describe('IdentityWallet.create', () => {
  const encryptionPass = 'secret'
  const testSeed = Buffer.from('a'.repeat(64), 'hex')
  const getTestIdw = () =>  new LocalDidMethod().recoverFromSeed(testSeed , encryptionPass).then(res => res.identityWallet)

  describe('Interaction Tokens', () => {
  })

  describe('correctly creates and signs a SignedCredential', () => {
    it('create sign a credential with the ed25519 key', async () => {
      const idw = await getTestIdw()

      const testClaim = {
        metadata: claimsMetadata.mobilePhoneNumber,
        claim: {
          telephone: '5013412'
        },
        subject: idw.did
      }

      const credential = await idw.create.signedCredential(testClaim, encryptionPass) 

      expect(credential.subject).equals(idw.did)
      expect(credential.claim).deep.equals(testClaim.claim)
      expect(credential.proof.type).equals('Ed25519Signature2018')

      expect(
        await parseAndValidate.signedCredential(credential.toJSON(), idw.identity)
      ).deep.equals(credential)
    })
  })
})
