import { fromSeed } from 'bip32'
import { randomBytes, createCipher, createDecipher } from 'crypto'
import { verify as eccVerify } from 'tiny-secp256k1'
import { IDigestable } from '../linkedDataSignature/types';

export interface IKeyDerivationArgs {
  encryptionPass: string
  derivationPath: string
}

export interface IVaultedKeyProvider {
  // getRandom: (nr: number) => Buffer 
  getPublicKey:(derivationArgs: IKeyDerivationArgs)=> Buffer
  getPrivateKey:(derivationArgs: IKeyDerivationArgs)=> Buffer
  sign: (derivationArgs: IKeyDerivationArgs, digest: Buffer) => Buffer
  verify: (publicKey: Buffer, signature: Buffer, digest: Buffer) => Boolean
  signDigestable: (derivationArgs: IKeyDerivationArgs, toSign: IDigestable) => Promise<Buffer>
  verifyDigestable: (publicKey: Buffer, toVerify: IDigestable) => Promise<boolean>
}
export class SoftwareKeyProvider implements IVaultedKeyProvider {
  private encryptedSeed: Buffer

  /*
   * @description - initializes the vault with the aes 256 cbc encrypted seed
   * @param seed - 32 byte seed for creating bip32 wallet
   * @param encryptionPass - password used to generate encryption cipher
  */

  constructor(seed: Buffer, encryptionPass: string) {
    this.encryptedSeed = this.encrypt(encryptionPass, seed)
  }

  /*
   * @description - returns child public key at specified path
   * @param derivationArgs - Data needed to derive child key
   * @param derivationArgs.encryptionPass - Password used to create the aes cipher
   * @param derivationArgs.derivationPath - The bip32 derivation path
   * @returns {Buffer} - public key at corresponding path
  */

  getPublicKey(derivationArgs: IKeyDerivationArgs): Buffer {
    const { encryptionPass, derivationPath } = derivationArgs
    const seed = this.decrypt(encryptionPass, this.encryptedSeed)
    return fromSeed(seed).derivePath(derivationPath).publicKey
  }

  /*
   * @TODO - Use csprng implementation
   * @description - Returns N bytes of random data
   * @param nrBytes - Number of bytes to verify
   * @returns {Buffer} - N random bytes
  */

  static getRandom(nr): Buffer {
    return randomBytes(nr)
  }

  /*
   * @description - computes secp256k1 signature given a 256 bit digest
   * @param derivationArgs - Data needed to derive child key
   * @param derivationArgs.encryptionPass - The encryption password
   * @param derivationArgs.derivationPath - The bip32 derivation path
   * @param digest - The data to sign, 256 bits
   * @returns {Buffer} - computed signature
  */

  sign(derivationArgs: IKeyDerivationArgs, digest: Buffer): Buffer {
    const { encryptionPass, derivationPath } = derivationArgs
    const seed = this.decrypt(encryptionPass, this.encryptedSeed)
    const signingKey = fromSeed(seed).derivePath(derivationPath)
    return signingKey.sign(digest)
  }

  /*
   * @description - verifies secp256k1 signature
   * @param digest - The digest of the data
   * @param signature - The signature to verify
   * @param publicKey - The signer's public key
   * @returns {Boolean} - signature validity
   * @
  */

  verify(digest: Buffer, publicKey: Buffer, signature: Buffer): boolean {
    return eccVerify(digest, publicKey, signature)
  }

  /*
   * Method will be deprecated soon, currently used for signing
   *  ethereum transactions, where normal secp256k1 signatures
   *  and the sign method exposed by this class are not enough
   * @description - returns child public key at specified path
   * @param derivationArgs - Data needed to derive child key
   * @param derivationArgs.encryptionPass - Password used to create the aes cipher
   * @param derivationArgs.derivationPath - The bip32 derivation path
   * @returns {Buffer} - public key at corresponding path
  */

  getPrivateKey(derivationArgs: IKeyDerivationArgs) {
    const { encryptionPass, derivationPath } = derivationArgs
    const seed = this.decrypt(encryptionPass, this.encryptedSeed)

    console.warn('METHOD WILL BE DEPRECATED SOON, ANTIPATTERN')
    return fromSeed(seed).derivePath(derivationPath).privateKey
  }

  /*
   * @description - digest the passed object, and computes the signature
   * @param derivationArgs - Data needed to derive child key
   * @param  toSign - Instance of class that implements IDigestable
   * @param derivationArgs.encryptionPass - The encryption password
   * @param derivationArgs.derivationPath - The bip32 derivation path
   * @returns {Buffer} - computed signature
  */

  async signDigestable(derivationArgs: IKeyDerivationArgs, toSign: IDigestable): Promise<Buffer> {
    const digest = await toSign.digest()
    return this.sign(derivationArgs, digest)
  }

  /*
   * @TODO - implement
   */
  async verifyDigestable(publicKey: Buffer, toVerify: IDigestable) : Promise<boolean>{
    const digest = await toVerify.digest()
    const signature = toVerify.getSignatureValue()
    return this.verify(publicKey, digest, signature)
  }

  /*
   * @description - encrypts data using aes 256 cbc
   * @param data - The data to encrypt
   * @param password - The encrpyion password
   * @returns {Buffer} - The encrypted data
  */

  private encrypt(password: string, data: Buffer): Buffer {
    const cipher = createCipher('aes-256-cbc', password)
    return Buffer.concat([cipher.update(data), cipher.final()])
  }

  /*
   * @description - decripts data using aes 256 cbc
   * @param data - The data to decrypt
   * @param password - The encrpyion password
   * @returns {Buffer} - The decrypted data
  */

  private decrypt(password: string, data: Buffer): Buffer {
    const decipher = createDecipher('aes-256-cbc', password)
    return Buffer.concat([decipher.update(data), decipher.final()])
  }
}
