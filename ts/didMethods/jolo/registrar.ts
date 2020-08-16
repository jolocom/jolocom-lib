import { Identity } from '../../identity/identity'
import { getRegistry } from 'jolo-did-registry'
import { DidDocument } from '../../identity/didDocument/didDocument'
import { ServiceEndpointsSection } from '../../identity/didDocument/sections'
import { fuelKeyWithEther } from '../../utils/helper'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from './constants'
import {
  IVaultedKeyProvider,
  KeyTypes,
  SoftwareKeyProvider,
  EncryptedWalletUtils,
} from '@jolocom/vaulted-key-provider'
import { publicKeyToDID } from '../../utils/crypto'
import { fromSeed } from 'bip32'

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

  const skp = await SoftwareKeyProvider.newEmptyWallet(impl, did, newPassword)
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
  public registry: ReturnType<typeof getRegistry>

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT,
  ) {
    this.registry = getRegistry(providerUrl, contractAddress, ipfsHost)
  }

  async create(keyProvider: SoftwareKeyProvider, password: string) {
    // generate a new key, add it to the vkp with the expected id, use that, then move the api to the vkp

    // TODO Does this matter?
    if (keyProvider.id !== 'id') {
      throw new Error('I SHOULD BE SETTING THIS FOR NOW')
    }

    await keyProvider.newKeyPair(
      password,
      KeyTypes.ecdsaSecp256k1VerificationKey2019,
      ANCHOR_KEY_REF,
    )

    const signingKey = await keyProvider.newKeyPair(
      password,
      KeyTypes.ecdsaSecp256k1VerificationKey2019,
      SIGNING_KEY_REF,
    )

    const did = publicKeyToDID(Buffer.from(signingKey.publicKeyHex, 'hex'))

    keyProvider.changeId(password, did)

    const identity = Identity.fromDidDocument({
      didDocument: await DidDocument.fromPublicKey(
        Buffer.from(signingKey.publicKeyHex, 'hex'),
      ),
    })

    // TODO
    await this.signDidDocument(identity.didDocument, keyProvider, password)

    await this.update(keyProvider, password, identity.didDocument)

    return identity
  }

  // TODO Verify signature on the public profile? Or just assume it's correct
  // TODO Public profile should perhaps be JSON / any, so that the registrars can be used without having to typecheck / guard / use generics
  async updatePublicProfile(
    keyProvider: SoftwareKeyProvider,
    password: string,
    identity: Identity,
    publicProfile: SignedCredential,
  ) {
    const { didDocument } = identity

    const publicProfileEntry = ServiceEndpointsSection.fromJSON(
      await this.registry.publishPublicProfile(
        identity.did,
        publicProfile.toJSON(),
      ),
    )

    const oldPublicProfileEntry = didDocument.service.findIndex(
      ({ type }) =>
        type ===
        claimsMetadata.publicProfile.type[
          claimsMetadata.publicProfile.type.length - 1
        ],
    )

    if (oldPublicProfileEntry !== -1) {
      didDocument.service.splice(oldPublicProfileEntry, 1, publicProfileEntry)
    } else {
      didDocument.addServiceEndpoint(publicProfileEntry)
    }

    identity.publicProfile = publicProfile

    await this.signDidDocument(didDocument, keyProvider, password)

    return this.update(keyProvider, password, didDocument).then(() => true)
  }

  public async encounter(): Promise<Identity> {
    throw new Error(`"encounter" not implemented for did:${this.prefix}`) // TODO Better error
  }

  private async signDidDocument(
    didDocument: DidDocument,
    keyProvider: IVaultedKeyProvider,
    password: string,
  ) {
    didDocument.hasBeenUpdated()
    return didDocument.sign(keyProvider, {
      keyRef: SIGNING_KEY_REF,
      encryptionPass: password,
    })
  }

  // TODO Won't work because we can't do eth tx signing in the VKP
  private async update(
    keyProvider: SoftwareKeyProvider,
    password: string,
    didDocument: DidDocument,
  ) {
    // Essentialy sign_raw with the encoded TX kinda, not really, this is Recoverable signature
    const anchoringKey = await keyProvider.getPubKey({
      encryptionPass: password,
      keyRef: ANCHOR_KEY_REF,
    })

    if (!anchoringKey) {
      throw new Error('CAN NOT ANCHOR, NO KEY')
    }

    await fuelKeyWithEther(Buffer.from(anchoringKey.publicKeyHex, 'hex'))

    // TODO The TX needs to be assembled here
    return this.registry.commitDidDoc(
      Buffer.from('', 'hex'),
      // @ts-ignore TODO The DID Document related types need to be harmonized
      didDocument.toJSON(),
    )
  }
}
