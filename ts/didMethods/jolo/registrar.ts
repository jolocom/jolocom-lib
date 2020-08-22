import { Identity } from '../../identity/identity'
import { getRegistrar } from '@jolocom/jolo-did-registrar'
import { DidDocument } from '../../identity/didDocument/didDocument'
import { ServiceEndpointsSection } from '../../identity/didDocument/sections'
import { fuelKeyWithEther } from '../../utils/helper'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from './constants'
import {
  KeyTypes,
  SoftwareKeyProvider,
  EncryptedWalletUtils,
  PublicKeyInfo
} from '@jolocom/vaulted-key-provider'
import { publicKeyToDID } from '../../utils/crypto'
import { fromSeed } from 'bip32'
import { validateDigestable } from '../../utils/validation'

const SIGNING_KEY_REF = `keys-1`
const ANCHOR_KEY_REF = `keys-2`
const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0"
const JOLO_DERIVATION_PATH = "m/73'/0'/0'/0"

export const joloSeedToEncryptedWallet = async (
  seed: Buffer,
  newPassword: string,
  impl: EncryptedWalletUtils,
): Promise<SoftwareKeyProvider> => {
  const joloKeys = fromSeed(seed).derivePath(JOLO_DERIVATION_PATH)
  const ethKeys = fromSeed(seed).derivePath(ETH_DERIVATION_PATH)
  const did = publicKeyToDID(joloKeys.publicKey)

  const skp = await SoftwareKeyProvider.newEmptyWallet(
    impl,
    did,
    newPassword
  )

  await skp.changeId(newPassword, did)

  await skp.addContent(newPassword, {
    type: ['BIP32JolocomIdentitySeedv0'],
    value: seed.toString('hex'),
  })

  await skp.addContent(newPassword, {
    controller: [`${did}#${SIGNING_KEY_REF}`],
    type: KeyTypes.ecdsaSecp256k1VerificationKey2019,
    publicKeyHex: joloKeys.publicKey.toString('hex'),
    private_key: joloKeys.privateKey.toString('hex'),
  })

  await skp.addContent(newPassword, {
    controller: [`${did}#${ANCHOR_KEY_REF}`],
    type: KeyTypes.ecdsaSecp256k1RecoveryMethod2020,
    publicKeyHex: ethKeys.publicKey.toString('hex'),
    private_key: ethKeys.privateKey.toString('hex'),
  })

  return skp
}

export class JolocomRegistrar implements IRegistrar {
  public prefix = 'jolo'
  public registrarFns: ReturnType<typeof getRegistrar>

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT,
  ) {
    this.registrarFns = getRegistrar(providerUrl, contractAddress, ipfsHost)
  }

  async create(keyProvider: SoftwareKeyProvider, password: string) {
    let signingKey: PublicKeyInfo

    if(keyProvider.id.includes(`did:${this.prefix}`)) {
      const existingSigningKey = await keyProvider.getPubKeyByController(
        password,
        `${keyProvider.id}#${SIGNING_KEY_REF}`,
      )

      const existingAnchoringKey = await keyProvider.getPubKeyByController(
         password,
        `${keyProvider.id}#${ANCHOR_KEY_REF}`,
      )

      if (!existingSigningKey || !existingAnchoringKey) {
        throw new Error('vault has jolo id, but is either missing the signing or anchoring keys')
      }

      signingKey = existingSigningKey
    } else {
      signingKey = await keyProvider.newKeyPair(
        password,
        KeyTypes.ecdsaSecp256k1VerificationKey2019,
        SIGNING_KEY_REF,
      )

      const did = publicKeyToDID(Buffer.from(signingKey.publicKeyHex, 'hex'))

      await keyProvider.setKeyController({
        encryptionPass: password,
        keyRef: SIGNING_KEY_REF
      }, `${did}:${SIGNING_KEY_REF}`)

      await keyProvider.changeId(password, did)

      await keyProvider.newKeyPair(
        password,
        KeyTypes.ecdsaSecp256k1RecoveryMethod2020,
        `${did}:${ANCHOR_KEY_REF}`,
      )
    }

    const identity = Identity.fromDidDocument({
      didDocument: await DidDocument.fromPublicKey(
        Buffer.from(signingKey.publicKeyHex, 'hex'),
      ),
    })

    await this.signDidDocument(identity.didDocument, keyProvider, password)
    await this.update(identity.didDocument, keyProvider, password)

    return identity
  }

  // TODO Public profile should perhaps be JSON / any, so that the registrars can be used without having to typecheck / guard / use generics
  async updatePublicProfile(
    keyProvider: SoftwareKeyProvider,
    password: string,
    identity: Identity,
    publicProfile: SignedCredential,
  ) {
    const { didDocument } = identity

    // TODO Better message
    if (!await validateDigestable(publicProfile, identity)) {
      throw new Error('Could not verify signature on the public profile. Update aborted.')
    }

    const pubProfSection = ServiceEndpointsSection.fromJSON(
      await this.registrarFns.publishPublicProfile(identity.did, publicProfile)
    )

    const oldPublicProfileEntry = didDocument.service.findIndex(({ type }) =>
      type === claimsMetadata.publicProfile.type[
        claimsMetadata.publicProfile.type.length - 1
      ])

    if (oldPublicProfileEntry !== -1) {
      didDocument.service.splice(oldPublicProfileEntry, 1, pubProfSection)
    } else {
      didDocument.addServiceEndpoint(pubProfSection)
    }

    identity.publicProfile = publicProfile

    await this.signDidDocument(didDocument, keyProvider, password)

    return this.update(didDocument, keyProvider, password).then(() => true)
  }

  public async encounter(): Promise<Identity> {
    throw new Error(`"encounter" not implemented for did:${this.prefix}`)
  }

  private async signDidDocument(
    didDocument: DidDocument,
    keyProvider: SoftwareKeyProvider,
    password: string,
  ) {
    didDocument.hasBeenUpdated()
    return didDocument.sign(keyProvider, {
      keyRef: `${keyProvider.id}#${SIGNING_KEY_REF}`,
      encryptionPass: password,
    })
  }

  private async update(
    didDocument: DidDocument,
    keyProvider: SoftwareKeyProvider,
    password: string
  ) {
    const anchoringKey = await keyProvider.getPubKeyByController(
      password,
      `${keyProvider.id}#${ANCHOR_KEY_REF}`,
    )

    if (!anchoringKey) {
      throw new Error("No anchoring key found")
    }

    const unsignedTx = await this.registrarFns.publishDidDocument(
      Buffer.from(anchoringKey.publicKeyHex.slice(2), 'hex'),
      //@ts-ignore
      didDocument.toJSON()
    )

    await fuelKeyWithEther(Buffer.from(anchoringKey.publicKeyHex, 'hex'))

    const signature = await keyProvider.sign({
      keyRef: anchoringKey.controller[0],
      encryptionPass: password
    }, Buffer.from(unsignedTx.slice(2), 'hex'))

    return this.registrarFns.broadcastTransaction(unsignedTx, {
      r: '0x' + signature.slice(0, 32).toString('hex'),
      s: '0x' + signature.slice(32, 64).toString('hex'),
      recoveryParam: signature[64]
    }).catch(console.log).then(() => true)
  }
}
