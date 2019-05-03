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
import { IDigestable } from '../../ts/linkedDataSignature/types'
import { publicProfileCredJSON, emailCredential } from '../data/identity.data'
import { keyDerivationArgs } from '../data/identityWallet.data'
import { JolocomLib } from '../../ts/index'
import { claimsMetadata } from 'cred-types-jolocom-core'

chai.use(sinonChai)
describe('Software Vaulted Key Provider', () => {
  const vault = new SoftwareKeyProvider(
    testSeed,
    keyDerivationArgs.encryptionPass,
  )

  describe('constructor', () => {
    it('Should fail to instantiate if entropy too short', () => {
      const faultyVault = new SoftwareKeyProvider(
        Buffer.from('a'),
        keyDerivationArgs.encryptionPass,
      )
      expect(() => faultyVault.getPrivateKey(keyDerivationArgs)).to.throw(
        TypeError,
        'Seed should be at least 128 bits',
      )
    })

    it('Should fail to instantiate if entropy too long', () => {
      const longEntropy = Buffer.concat([testSeed, testSeed, testSeed])
      const faultyVault = new SoftwareKeyProvider(
        longEntropy,
        keyDerivationArgs.encryptionPass,
      )
      expect(() => faultyVault.getPrivateKey(keyDerivationArgs)).to.throw(
        TypeError,
        'Seed should be at most 512 bits',
      )
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
      expect(random.calledWith(nrOfBytes)).to.be.true

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
      expect(SoftwareKeyProvider.verify(msgToSign, pubKey, msgSignature)).to.be
        .true
    })

    it('Should correctly detect invalid signature', () => {
      expect(SoftwareKeyProvider.verify(msgToSign, pubKey, incorrectSignature))
        .to.be.false
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

  describe('signDigestable', () => {
    const credentialToSign = SignedCredential.fromJSON(publicProfileCredJSON)
    let sign

    before(() => {
      sign = sinon.stub(vault, 'sign')
    })

    after(() => {
      sign.restore()
    })

    it('Should correctly digest passed object and call compute signature', async () => {
      await vault.signDigestable(keyDerivationArgs, credentialToSign)
      const [argPubKey, argDigest] = sign.getCall(0).args

      expect(argPubKey).to.deep.eq(keyDerivationArgs)
      expect(argDigest).to.deep.eq(credentialDigest)
    })

    /* Invalid inputs unrelated to digesting are tested in the vault.sign block */

    it('Should fail to compute signature if object or key data is invalid', async () => {
      try {
        await vault.signDigestable(keyDerivationArgs, {} as IDigestable)
        expect(false).to.be.true
      } catch (err) {
        expect(err.message).to.eq('toSign.digest is not a function')
      }
    })
  })

  /* Invalid input is covered in vault.signDigestable and vault.verify blocks */

  describe('validateDigestable', () => {
    const credentialToSign = SignedCredential.fromJSON(emailCredential)
    const pubKey = vault.getPublicKey(keyDerivationArgs)

    it('Should correctly digest passed object and validate the signature', async () => {
      expect(
        await SoftwareKeyProvider.verifyDigestable(pubKey, credentialToSign),
      ).to.be.true
    })

    it('Should correctly detect incorrect signature', async () => {
      const corruptedCredential = SignedCredential.fromJSON(
        corruptedSignedCredentialJSON,
      )
      expect(
        await SoftwareKeyProvider.verifyDigestable(pubKey, corruptedCredential),
      ).to.be.false
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
