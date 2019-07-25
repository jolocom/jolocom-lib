import { fromSeed } from 'bip32'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { verify as eccVerify } from 'tiny-secp256k1'
import { IDigestable } from '../linkedDataSignature/types'
import { IVaultedKeyProvider, IKeyDerivationArgs } from './types'
import { entropyToMnemonic, mnemonicToEntropy, validateMnemonic } from 'bip39'
import { sha256 } from '../utils/crypto'

const ALG = 'aes-256-cbc'

/** @dev length in bytes */
const PASSWORD_LENGTH = 32
const CIPHERTEXT_LENGTH = 48
const IV_LENGTH = 16
const ENCRYPTED_SEED_LENGTH = IV_LENGTH + CIPHERTEXT_LENGTH

export class SoftwareKeyProvider implements IVaultedKeyProvider {
  private readonly _encryptedSeed: Buffer
  private readonly _iv: Buffer

  /**
   * Initializes the vault with an already encrypted aes 256 cbc seed
   * @param encryptedSeed - the ciphertext; format: IV || ciphertext, where '||' denotes concatenation
   */

  public constructor(encryptedSeed: Buffer) {
    if (encryptedSeed.length !== ENCRYPTED_SEED_LENGTH) {
      throw new Error(
        `Expected encrypted seed to be ${ENCRYPTED_SEED_LENGTH} bytes long (${IV_LENGTH} IV + ${CIPHERTEXT_LENGTH} ciphertext), got ${
          encryptedSeed.length
        }`,
      )
    }

    this._iv = encryptedSeed.slice(0, IV_LENGTH)
    this._encryptedSeed = encryptedSeed.slice(IV_LENGTH)
  }

  /**
   * Get the encrypted seed; format: IV || ciphertext, where '||' denotes concatenation
   */

  public get encryptedSeed() {
    return Buffer.concat([this._encryptedSeed, this._iv])
  }

  /**
   * Initializes the vault with the aes 256 cbc encrypted seed
   * @param seed - 32 byte seed for creating bip32 wallet
   * @param encryptionPass - password used to generate encryption cipher, UTF-8, 32 bytes
   * @example `const vault = new SoftwareKeyProvider(Buffer.from('abc...', 'hex'), 'secret')`
   */
  public static fromSeed(
    seed: Buffer,
    encryptionPass: string,
  ): SoftwareKeyProvider {
    const iv = SoftwareKeyProvider.getRandom(IV_LENGTH)
    const encryptedSeed = SoftwareKeyProvider.encrypt(
      SoftwareKeyProvider.normalizePassword(encryptionPass),
      seed,
      iv,
    )

    return new SoftwareKeyProvider(Buffer.concat([iv, encryptedSeed]))
  }

  /**
   * Recover the Key Provider based on a bip39 mnemonic seed phrase
   * @param mnemonic - string that contains the seed phrase
   * @param encryptionPass - password used to generated encryption cipher
   * @returns an instance of the VaultedKeyProvider
   * @example SoftwareKeyProvider.recoverKeyPair('fluid purse degree ...', 'secret')
   */
  public static recoverKeyPair(
    mnemonic: string,
    encryptionPass: string,
  ): IVaultedKeyProvider {
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid Mnemonic.')
    }

    const seed = Buffer.from(mnemonicToEntropy(mnemonic), 'hex')
    return SoftwareKeyProvider.fromSeed(seed, encryptionPass)
  }

  /**
   * Derives and returns child public key at specified path
   * @param derivationArgs - Password for seed decryption and derivation path
   * @example `vault.getPublicKey({derivationPath: ..., decryptionPass: ...}) // Buffer <...>`
   */

  public getPublicKey(derivationArgs: IKeyDerivationArgs): Buffer {
    const { encryptionPass, derivationPath } = derivationArgs

    const seed = SoftwareKeyProvider.decrypt(
      SoftwareKeyProvider.normalizePassword(encryptionPass),
      this._encryptedSeed,
      this._iv,
    )
    return fromSeed(seed).derivePath(derivationPath).publicKey
  }

  /**
   * Returns N bytes of random data
   * @param nr - Number of bytes to verify
   * @example `vault.getRandom(32) // Buffer <...>`
   */

  // TODO - Use csprng implementation
  public static getRandom(nr: number): Buffer {
    return randomBytes(nr)
  }

  /**
   * Computes secp256k1 signature given a 256 bit digest
   * @param derivationArgs - Password for seed decryption and derivation path
   * @param digest - The data to sign, 256 bits
   * @example `vault.sign({derivationPath: ..., decryptionPass: ...}, Buffer <...>) // Buffer <...>`
   */

  public sign(derivationArgs: IKeyDerivationArgs, digest: Buffer): Buffer {
    const { encryptionPass, derivationPath } = derivationArgs
    const seed = SoftwareKeyProvider.decrypt(
      SoftwareKeyProvider.normalizePassword(encryptionPass),
      this._encryptedSeed,
      this._iv,
    )
    const signingKey = fromSeed(seed).derivePath(derivationPath)
    return signingKey.sign(digest)
  }

  /**
   * Verifies secp256k1 signature
   * @param digest - The digest of the data
   * @param signature - The signature to verify
   * @param publicKey - The signer's public key
   * @example `SoftwareKeyProvider.verify(digest, publicKey, signature) // true`
   */

  public static verify(
    digest: Buffer,
    publicKey: Buffer,
    signature: Buffer,
  ): boolean {
    return eccVerify(digest, publicKey, signature)
  }

  /**
   * Derives and returns the child private key at specified path
   * @deprecated Will be removed in next major release, currently used for signing Ethereum transactions
   * @param derivationArgs - Password for seed decryption and derivation path
   * @example `vault.getPrivateKey({derivationPath: ..., decryptionPass: ...}) // Buffer <...>`
   */

  public getPrivateKey(derivationArgs: IKeyDerivationArgs): Buffer {
    const { encryptionPass, derivationPath } = derivationArgs
    const seed = SoftwareKeyProvider.decrypt(
      SoftwareKeyProvider.normalizePassword(encryptionPass),
      this._encryptedSeed,
      this._iv,
    )

    console.warn('METHOD WILL BE DEPRECATED SOON, ANTIPATTERN')
    return fromSeed(seed).derivePath(derivationPath).privateKey
  }

  /**
   * Returns the mnemonic of the stored seed
   * @param encryptionPass - Password for seed decryption
   */
  public getMnemonic(encryptionPass: string): string {
    const seed = SoftwareKeyProvider.decrypt(
      SoftwareKeyProvider.normalizePassword(encryptionPass),
      this._encryptedSeed,
      this._iv,
    )
    return entropyToMnemonic(seed)
  }

  /**
   * Digests the passed object, and computes the signature
   * @param derivationArgs - Password for seed decryption and derivation path
   * @param toSign - Instance of class that implements the {@link IDigestable} interface
   * @param derivationArgs.encryptionPass - The encryption password
   * @param derivationArgs.derivationPath - The bip32 derivation path
   * @example `await vault.signDigestable(derivationArgs, publicProfileCredential) // Buffer <...>`
   */

  public async signDigestable(
    derivationArgs: IKeyDerivationArgs,
    toSign: IDigestable,
  ): Promise<Buffer> {
    const digest = await toSign.digest()
    return this.sign(derivationArgs, digest)
  }

  /**
   * Digest the passed object, and validate the signature using a provided public key
   * @param toVerify - Instance of class that implements IDigestable
   * @param publicKey - Public key used to generate the signature
   * @example `await SoftwareKeyProvider.verifyDigestable(publicKey, publicProfileSignedCredential) // true`
   */

  public static async verifyDigestable(
    publicKey: Buffer,
    toVerify: IDigestable,
  ): Promise<boolean> {
    const digest = await toVerify.digest()
    const signature = Buffer.from(toVerify.signature, 'hex')
    return SoftwareKeyProvider.verify(digest, publicKey, signature)
  }

  /**
   * Encrypts data using the aes 256 cbc cipher
   * @param data - The data to encrypt
   * @param key - The encryption key
   * @param iv - Random initialisation vector
   */

  private static encrypt(key: Buffer, data: Buffer, iv: Buffer): Buffer {
    const cipher = createCipheriv(ALG, key, iv)
    return Buffer.concat([cipher.update(data), cipher.final()])
  }

  /**
   * Decrypts data using the aes 256 cbc cipher
   * @param data - The data to decrypt
   * @param key - The decryption password
   * @param iv - Random initialisation vector
   */

  private static decrypt(key: Buffer, data: Buffer, iv: Buffer): Buffer {
    const decipher = createDecipheriv(ALG, key, iv)
    return Buffer.concat([decipher.update(data), decipher.final()])
  }

  /**
   * aes 256 cbc with IV requires 32 byte encryption keys, in case the user provided
   *  password is not long enough, we digest it using sha256 and print a warning instead
   *  of throwing an error
   * @param password - The user provided password, treated as UTF-8 string
   * @returns normalizePassword - 32 byte long buffer used as encryption key, either original password, or it's sha256 digest
   */

  private static normalizePassword(password: string): Buffer {
    const passwordBuffer = Buffer.from(password)

    if (!passwordBuffer.length) return
    if (passwordBuffer.length !== PASSWORD_LENGTH) {
      console.warn(
        `Provided password must have a length of ${PASSWORD_LENGTH} bytes, received ${
          passwordBuffer.length
        }. We will compute the sha256 hash of the provided password and use it instead`,
      )

      return sha256(passwordBuffer)
    }

    return passwordBuffer
  }
}
