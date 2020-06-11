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
import { mockDid } from '../data/didDocument.data'
import { ErrorCodes } from '../../ts/errors'

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
      expect(vault.encryptedSeed).to.deep.eq(testEncryptedSeed.toString('hex'))
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
      ).to.eq(true)
    })

    it('Should correctly detect incorrect signature', async () => {
      const corruptedCredential = SignedCredential.fromJSON(
        corruptedSignedCredentialJSON,
      )
      expect(
        await SoftwareKeyProvider.verifyDigestable(pubKey, corruptedCredential),
      ).to.eq(false)
    })
  })

  describe('getMnemonic', () => {
    it('should return the mnemonic phrase', function() {
      expect(vault.getMnemonic(keyDerivationArgs.encryptionPass)).to.equal(
        testMnemonic,
      )
    })

    it('should return mnemonic phrase containing the DID', () => {
      const idString = mockDid.substring(mockDid.lastIndexOf(':') + 1)
      expect(
        vault.getMnemonic(keyDerivationArgs.encryptionPass, idString),
      ).to.eq(
        'primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary foster ready put cup oblige divorce boost all hedgehog peasant rule item pepper aware brother treat middle spin tooth diet crack skill trap fruit undo',
      )
    })
  })

  describe('recoverKeyPair', () => {
    it('should correctly return a VaultedKeyProvider', function() {
      const newVault = SoftwareKeyProvider.recoverKeyPair(
        testMnemonic,
        keyDerivationArgs.encryptionPass,
      )
      expect(newVault.getPublicKey(keyDerivationArgs)).to.deep.eq(
        vault.getPublicKey(keyDerivationArgs),
      )
    })

    it('should fail if the mnemonic is wrong', function() {
      expect(() =>
        SoftwareKeyProvider.recoverKeyPair(
          'Wrong Mnemonic',
          keyDerivationArgs.encryptionPass,
        ),
      ).to.throw(Error, ErrorCodes.SKPMnemonicInvalid)
    })
  })

  describe('Hybrid encryption', () => {
    let randomMock
    const clearText = { item: 'some data' }
    const chipherText = {
      data:
        '38ad7bcc993ccecef1a9c69a38c15d862a024c626c0c1e3f1df6445d3a74fe80964a59fd7c19c80bcfd6840ac72bc44c',
      keys: [
        {
          cipher:
            'eyJpdiI6IjM4YWQ3YmNjOTkzY2NlY2VmMWE5YzY5YTM4YzE1ZDg2IiwiZXBoZW1QdWJsaWNLZXkiOiIwNGI5M2RkNzExYzdlYWJjMzMwY2NlNGQ4ZGMzMzM1YzBhNDJjZjY4ZGRmZTJkOGYwMjIzNjYwOTQ3ZWExNjc3NDExM2VmZmNjZmU5ZGIwOWVkYzFhMGIyYzI3NWMxOTViZWZmOGNiZTQ5M2Y4MzBiODE3YmRkNGFkYjM4NjI2OTg1IiwiY2lwaGVydGV4dCI6IjA0MTVjYTk3MjllNTI3ODU3NTZkMDc2ZDUxYjFhYTdmNzAzYTcyMTI1OGQzN2QwZTMwZjIzNjMwMWQ5NmExM2Q5NTE0N2JjMTY5MjZjYWE0MmQzNTdkZTM1MmQyZjIwOSIsIm1hYyI6ImRhNGEyOGMxNWUxYTA1MmJiYTg5YzQ5MGEzYzkzOTJlMjA1YmIwM2RlZTY0ZDJhODU3YTIyODBjYzY5MWViODgifQ==',
          pubKey:
            '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
        },
      ],
    }
    before(() => {
      randomMock = sinon.stub(crypto, 'randomBytes')

      randomMock
        .withArgs(32) // mock for password generation
        .returns(
          Buffer.from(
            '38ad7bcc993ccecef1a9c69a38c15d862fe12feea84210c671eebf208aa35fe6',
            'hex',
          ),
        )
      randomMock
        .withArgs(16) // mock for iv generation
        .returns(Buffer.from('38ad7bcc993ccecef1a9c69a38c15d86', 'hex'))
    })
    after(() => {
      randomMock.restore()
    })

    it('should encrypt data with hybrid scheme', async () => {
      const encrypted = await vault.encryptHybrid(clearText, keyDerivationArgs)
      expect(encrypted).to.deep.eq(chipherText)
    })

    it('should decrypt data with hybrid scheme', async () => {
      const decryped = await vault.decryptHybrid(chipherText, keyDerivationArgs)
      expect(decryped).to.deep.eq(clearText)
    })
    it('should encrypt and decrypt', async () => {
      const data = SoftwareKeyProvider.getRandom(32)

      const enc = await vault.asymEncrypt(
        data,
        vault.getPublicKey(keyDerivationArgs),
      )

      const dec = await vault.asymDecrypt(enc, keyDerivationArgs)

      expect(dec.toString('base64')).to.eq(data.toString('base64'))
      expect(enc).to.not.eq(data.toString('base64'))
    })
    describe('Buffer decoding/encoding', () => {
      const data = {
        item: Buffer.from('546573742054657874', 'hex'),
        otherItem: Buffer.from('536F6D652044617461', 'hex'),
      }
      const dataString =
        '{"item":"546573742054657874","otherItem":"536f6d652044617461"}'

      it('should stringify Buffer to hex', () => {
        // @ts-ignore
        const output = vault.stringifyEncryptedData(data)
        expect(output).to.eq(dataString)
      })

      it('should convert hex data to Buffer', () => {
        // @ts-ignore
        const output = vault.parseEncryptedData(dataString)
        expect(output).to.deep.eq(data)
      })
    })
  })
})
