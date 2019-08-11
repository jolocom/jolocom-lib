import * as chai from 'chai'
import * as crypto from 'crypto'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import {
  testSeed,
  testPublicIdentityKey,
  testIncorrectPublicIdentityKey,
  testPrivateIdentityKey,
  testMnemonic,
} from '../data/keys.data'
import { expect } from 'chai'
import {
  msgToSign,
  msgSignature,
  invalidMsgToSign,
  incorrectSignature,
  invalidtSignature,
  credentialDigest,
  corruptedSignedCredentialJSON,
} from '../data/keyProvider.data'
import { IDigestible } from '../../ts/linkedDataSignature/types'
import { publicProfileCredJSON, emailCredential } from '../data/identity.data'
import { keyDerivationArgs } from '../data/identityWallet.data'

chai.use(sinonChai)
describe('Software Vaulted Key Provider', () => {
  const vault = SoftwareKeyProvider.fromSeed(
    testSeed,
    keyDerivationArgs.encryptionPass,
  )

  describe('static fromSeed', () => {
    it('Should instantiated with all accepted seed lengths', () => {
      const { encryptionPass: pass } = keyDerivationArgs

      /** Helper function to save on typing */
      const testFromSeedAndMnemonic = (seedLength, seedPhraseLength) => {
        const provider = SoftwareKeyProvider.fromSeed(
          Buffer.from('a'.repeat(seedLength)),
          pass,
        )

        expect(provider.getMnemonic(pass).split(' ').length).to.eq(
          seedPhraseLength,
        )
      }

      testFromSeedAndMnemonic(16, 12)
      testFromSeedAndMnemonic(20, 15)
      testFromSeedAndMnemonic(24, 18)
      testFromSeedAndMnemonic(28, 21)
      testFromSeedAndMnemonic(32, 24)
    })

    it('Should fail to instantiate if entropy too short', () => {
      expect(() =>
        SoftwareKeyProvider.fromSeed(
          Buffer.from('a'),
          keyDerivationArgs.encryptionPass,
        ),
      ).to.throw()
    })

    it('Should fail to instantiate if entropy too long', () => {
      const longEntropy = Buffer.concat([testSeed, testSeed, testSeed])
      expect(() =>
        SoftwareKeyProvider.fromSeed(
          longEntropy,
          keyDerivationArgs.encryptionPass,
        ),
      ).to.throw()
    })

    it('Should fail to instantiate if password is empty', () => {
      expect(() => SoftwareKeyProvider.fromSeed(testSeed, '')).to.throw()
    })
  })

  describe('encryptedSeed accessor', () => {
    it('should correctly concatenate IV with ciphertext', () => {
      const testIV = Buffer.from('a'.repeat(32), 'hex')
      const testCiphertext = Buffer.from('a'.repeat(96), 'hex')
      const testEncryptedSeed = Buffer.concat([testIV, testCiphertext])

      const vault = new SoftwareKeyProvider(testEncryptedSeed)
      expect(vault.encryptedSeed).to.deep.eq(testEncryptedSeed)
    })
  })

  describe('getPublicKey', () => {
    it('Should correctly derive public key given path and pasword', () => {
      expect(vault.getPublicKey(keyDerivationArgs)).to.deep.eq(
        testPublicIdentityKey,
      )
    })

    it('Should fail if password is missing', () => {
      const faultyArgs = { ...keyDerivationArgs, encryptionPass: '' }
      expect(() => vault.getPublicKey(faultyArgs)).to.throw()
    })

    it('Should fail if path is missing', () => {
      const faultyArgs = { ...keyDerivationArgs, derivationPath: '' }
      expect(() => vault.getPublicKey(faultyArgs)).to.throw(
        Error,
        'Expected BIP32Path, got String ""',
      )
    })
  })

  describe('getRandom', () => {
    it('Should correctly call crypto.randomBytes', () => {
      const fixedRandom = Buffer.from('1234', 'hex')
      const nrOfBytes = 2

      const random = sinon.stub(crypto, 'randomBytes').returns(fixedRandom)
      expect(SoftwareKeyProvider.getRandom(nrOfBytes)).to.deep.eq(fixedRandom)
      expect(random.calledWith(nrOfBytes)).to.eq(true)

      random.restore()
    })
  })

  describe('sign', () => {
    it('Should correctly compute signature given digest and key data', () => {
      expect(vault.sign(keyDerivationArgs, msgToSign)).to.deep.eq(msgSignature)
    })

    it('Should fail to compute signature if digest or key data are invalid', () => {
      expect(() => vault.sign(keyDerivationArgs, invalidMsgToSign)).to.throw(
        TypeError,
        'Expected Hash',
      )
    })
  })

  describe('verify', () => {
    const pubKey = vault.getPublicKey(keyDerivationArgs)

    it('Should correctly validate signature given digest signature, and public key', () => {
      expect(SoftwareKeyProvider.verify(msgToSign, pubKey, msgSignature)).to.eq(
        true,
      )
    })

    it('Should correctly detect invalid signature', () => {
      expect(
        SoftwareKeyProvider.verify(msgToSign, pubKey, incorrectSignature),
      ).to.eq(false)
    })

    it('Should throw given invalid input', () => {
      expect(() =>
        SoftwareKeyProvider.verify(invalidMsgToSign, pubKey, msgSignature),
      ).to.throw(Error, 'Expected Hash')
      expect(() =>
        SoftwareKeyProvider.verify(msgToSign, pubKey, invalidtSignature),
      ).to.throw(Error, 'Expected Signature')
      expect(() =>
        SoftwareKeyProvider.verify(
          msgToSign,
          testIncorrectPublicIdentityKey,
          msgSignature,
        ),
      ).to.throw(Error, 'Expected Point')
    })
  })

  /* Testing for invalid inputs is covered in the getPublicKey block */

  describe('getPrivateKey', () => {
    it('Should correctly derive public key given path and pasword', () => {
      expect(vault.getPrivateKey(keyDerivationArgs)).to.deep.eq(
        testPrivateIdentityKey,
      )
    })
  })

  describe('signDigestible', () => {
    const credentialToSign = SignedCredential.fromJSON(publicProfileCredJSON)
    let sign

    before(() => {
      sign = sinon.stub(vault, 'sign')
    })

    after(() => {
      sign.restore()
    })

    it('Should correctly digest passed object and call compute signature', async () => {
      await vault.signDigestible(keyDerivationArgs, credentialToSign)
      const [argPubKey, argDigest] = sign.getCall(0).args

      expect(argPubKey).to.deep.eq(keyDerivationArgs)
      expect(argDigest).to.deep.eq(credentialDigest)
    })

    /* Invalid inputs unrelated to digesting are tested in the vault.sign block */

    it('Should fail to compute signature if object or key data is invalid', async () => {
      try {
        await vault.signDigestible(keyDerivationArgs, {} as IDigestible)
        expect(false).to.be.true
      } catch (err) {
        expect(err.message).to.eq('toSign.digest is not a function')
      }
    })
  })

  /* Invalid input is covered in vault.signDigestible and vault.verify blocks */

  describe('validateDigestible', () => {
    const credentialToSign = SignedCredential.fromJSON(emailCredential)
    const pubKey = vault.getPublicKey(keyDerivationArgs)

    it('Should correctly digest passed object and validate the signature', async () => {
      expect(
        await SoftwareKeyProvider.verifyDigestible(pubKey, credentialToSign),
      ).to.eq(true)
    })

    it('Should correctly detect incorrect signature', async () => {
      const corruptedCredential = SignedCredential.fromJSON(
        corruptedSignedCredentialJSON,
      )
      expect(
        await SoftwareKeyProvider.verifyDigestible(pubKey, corruptedCredential),
      ).to.eq(false)
    })
  })

  describe('getMnemonic', () => {
    it('should return the mnemonic phrase', function() {
      expect(vault.getMnemonic(keyDerivationArgs.encryptionPass)).to.equal(
        testMnemonic,
      )
    })
  })

  describe('recoverKeyPair', () => {
    it('should correctly return a VaultedKeyProvider', function() {
      const vault = SoftwareKeyProvider.recoverKeyPair(
        testMnemonic,
        keyDerivationArgs.encryptionPass,
      )
      expect(vault.getPrivateKey(keyDerivationArgs)).to.deep.eq(
        testPrivateIdentityKey,
      )
    })

    it('should fail if the mnemonic is wrong', function() {
      expect(() =>
        SoftwareKeyProvider.recoverKeyPair(
          'Wrong Mnemonic',
          keyDerivationArgs.encryptionPass,
        ),
      ).to.throw(Error, 'Invalid Mnemonic.')
    })
  })
})
