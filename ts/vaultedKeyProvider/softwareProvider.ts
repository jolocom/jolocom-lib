import { fromSeed } from 'bip32'
import { randomBytes, createCipher, createDecipher } from 'crypto'
import { verify as eccVerify } from 'tiny-secp256k1'
import { IDigestable } from '../linkedDataSignature/types'
import { IVaultedKeyProvider, IKeyDerivationArgs } from './types'
import { entropyToMnemonic, mnemonicToEntropy, validateMnemonic } from 'bip39'

export class SoftwareKeyProvider implements IVaultedKeyProvider {
  public readonly encryptedSeed: Buffer

  /**
   * Initializes the vault with an already encrypted aes 256 cbc seed
   * @param encryptedSeed
   */
  public constructor(encryptedSeed: Buffer) {
    this.encryptedSeed = encryptedSeed
  }

  /**
   * Initializes the vault with the aes 256 cbc encrypted seed
   * @param seed - 32 byte seed for creating bip32 wallet
   * @param encryptionPass - password used to generate encryption cipher
   * @example `const vault = new SoftwareKeyProvider(Buffer.from('abc...', 'hex'), 'secret')`
   */
  public static fromSeed(
    seed: Buffer,
    encryptionPass: string,
  ): SoftwareKeyProvider {
    const encryptedSeed = SoftwareKeyProvider.encrypt(encryptionPass, seed)
    return new SoftwareKeyProvider(encryptedSeed)
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
    const seed = SoftwareKeyProvider.decrypt(encryptionPass, this.encryptedSeed)
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
    const seed = SoftwareKeyProvider.decrypt(encryptionPass, this.encryptedSeed)
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
    const seed = SoftwareKeyProvider.decrypt(encryptionPass, this.encryptedSeed)

    console.warn('METHOD WILL BE DEPRECATED SOON, ANTIPATTERN')
    return fromSeed(seed).derivePath(derivationPath).privateKey
  }

  /**
   * Returns the mnemonic of the stored seed
   * @param password - Password for seed decryption
   */
  public getMnemonic(password: string): string {
    const seed = SoftwareKeyProvider.decrypt(password, this.encryptedSeed)
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
   * @param password - The encrpyion password
   * @example `this.encrypt('secret', Buffer.from('abc..fe', 'hex'))`
   */

  private static encrypt(password: string, data: Buffer): Buffer {
    const cipher = createCipher('aes-256-cbc', password)
    return Buffer.concat([cipher.update(data), cipher.final()])
  }

  /**
   * Dencrypts data using the aes 256 cbc cipher
   * @param data - The data to dencrypt
   * @param password - The dencrpyion password
   * @example `this.dencrypt('secret', encrypted)`
   */

  private static decrypt(password: string, data: Buffer): Buffer {
    const decipher = createDecipher('aes-256-cbc', password)
    return Buffer.concat([decipher.update(data), decipher.final()])
  }
}
