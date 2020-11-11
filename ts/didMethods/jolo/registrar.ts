import { Identity } from '../../identity/identity'
import { getRegistrar } from '@jolocom/jolo-did-registrar'
import { DidDocument } from '../../identity/didDocument/didDocument'
import {
  ServiceEndpointsSection,
  PublicKeySection,
} from '../../identity/didDocument/sections'
import { fuelKeyWithEther, stripHexPrefix } from '../../utils/helper'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from './constants'
import {
  KeyTypes,
  SoftwareKeyProvider,
  PublicKeyInfo,
} from '@jolocom/vaulted-key-provider'
import { validateDigestable } from '../../utils/validation'
import { KEY_REFS } from './constants'
import { publicKeyToJoloDID } from './utils'
import { addHexPrefix } from 'ethereumjs-util'

const { SIGNING_KEY_REF, ANCHOR_KEY_REF, ENCRYPTION_KEY_REF } = KEY_REFS

export class JolocomRegistrar implements IRegistrar {
  private _prefix: string
  public registrarFns: ReturnType<typeof getRegistrar>

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT,
    prefix = 'jolo'
  ) {
    this.registrarFns = getRegistrar(providerUrl, contractAddress, ipfsHost)
    this._prefix = prefix
  }

  get prefix() {
    return this._prefix
  }

  async create(keyProvider: SoftwareKeyProvider, password: string) {
    let signingKey: PublicKeyInfo
    let encryptionKey: PublicKeyInfo

    if (keyProvider.id.startsWith(`did:${this.prefix}`)) {
      const existingSigningKey = await keyProvider
        .getPubKeyByController(password, `${keyProvider.id}#${SIGNING_KEY_REF}`)
        .catch(_ => {
          throw new Error(
            `Jolo registrar - No signing key with ref ${SIGNING_KEY_REF} found`,
          )
        })

      const existingAnchoringKey = await keyProvider
        .getPubKeyByController(password, `${keyProvider.id}#${ANCHOR_KEY_REF}`)
        .catch(_ => {
          throw new Error(
            `Jolo registrar - No anchoring key with ref ${ANCHOR_KEY_REF} found`,
          )
        })

      const existingEncryptionKey = await keyProvider
        .getPubKeyByController(
          password,
          `${keyProvider.id}#${ENCRYPTION_KEY_REF}`,
        )
        .catch(_ => {
          throw new Error(
            `Jolo registrar - No encryption key with ref ${ENCRYPTION_KEY_REF} found`,
          )
        })

      if (
        !existingSigningKey ||
        !existingAnchoringKey ||
        !existingEncryptionKey
      ) {
        throw new Error(
          'vault has jolo id, but is either missing the signing, anchoring, or encr key',
        )
      }

      signingKey = existingSigningKey
      encryptionKey = existingEncryptionKey
    } else {
      signingKey = await keyProvider.newKeyPair(
        password,
        KeyTypes.ecdsaSecp256k1VerificationKey2019,
        SIGNING_KEY_REF,
      )

      const did = publicKeyToJoloDID(
        Buffer.from(signingKey.publicKeyHex, 'hex'),
      )

      await keyProvider.changeId(password, did)

      await keyProvider.setKeyController(
        {
          encryptionPass: password,
          keyRef: signingKey.id,
        },
        `${did}#${SIGNING_KEY_REF}`,
      )

      await keyProvider.newKeyPair(
        password,
        KeyTypes.ecdsaSecp256k1RecoveryMethod2020,
        `${did}#${ANCHOR_KEY_REF}`,
      )

      encryptionKey = await keyProvider.newKeyPair(
        password,
        KeyTypes.x25519KeyAgreementKey2019,
        `${did}#${ENCRYPTION_KEY_REF}`,
      )
    }

    const didDocumentInstace = await DidDocument.fromPublicKey(
      Buffer.from(signingKey.publicKeyHex, 'hex'),
    )

    didDocumentInstace.addPublicKeySection(
      PublicKeySection.fromJSON({ ...encryptionKey }),
    )

    const identity = Identity.fromDidDocument({
      didDocument: didDocumentInstace,
    })

    await this.signDidDocument(identity.didDocument, keyProvider, password)
    await this.update(identity.didDocument, keyProvider, password)

    return identity
  }

  // TODO Document, also make use of internally
  async didDocumentFromKeyProvider(
    keyProvider: SoftwareKeyProvider,
    password: string,
  ) {
    const did = keyProvider.id
    const signingKey = await keyProvider.getPubKeyByController(
      password,
      `${did}#${SIGNING_KEY_REF}`,
    )
    const encryptionKey = await keyProvider.getPubKeyByController(
      password,
      `${did}#${ENCRYPTION_KEY_REF}`,
    )

    if (!signingKey || !encryptionKey) {
      throw new Error(
        `Could not find signing or encryption key. Vault id - ${did}`,
      )
    }

    const didDocumentInstace = await DidDocument.fromPublicKey(
      Buffer.from(signingKey.publicKeyHex, 'hex'),
    )

    didDocumentInstace.addPublicKeySection(
      PublicKeySection.fromJSON({ ...encryptionKey }),
    )

    const identity = Identity.fromDidDocument({
      didDocument: didDocumentInstace,
    })

    await this.signDidDocument(identity.didDocument, keyProvider, password)

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
    if (!(await validateDigestable(publicProfile, identity))) {
      throw new Error(
        'Could not verify signature on the public profile. Update aborted.',
      )
    }

    const pubProfSection = ServiceEndpointsSection.fromJSON(
      await this.registrarFns.publishPublicProfile(identity.did, publicProfile),
    )

    const oldPublicProfileEntry = didDocument.service.findIndex(
      ({ type }) =>
        type ===
        claimsMetadata.publicProfile.type[
        claimsMetadata.publicProfile.type.length - 1
        ],
    )

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
    password: string,
  ) {
    const anchoringKey = await keyProvider.getPubKeyByController(
      password,
      `${keyProvider.id}#${ANCHOR_KEY_REF}`,
    )

    if (!anchoringKey) {
      throw new Error('No anchoring key found')
    }

    const unsignedTx = await this.registrarFns.publishDidDocument(
      Buffer.from(stripHexPrefix(anchoringKey.publicKeyHex), 'hex'),
      //@ts-ignore
      didDocument.toJSON(),
    )

    await fuelKeyWithEther(Buffer.from(anchoringKey.publicKeyHex, 'hex'))

    const signature = await keyProvider.sign(
      {
        keyRef: anchoringKey.controller[0],
        encryptionPass: password,
      },
      Buffer.from(stripHexPrefix(unsignedTx), 'hex'),
    )

    return this.registrarFns
      .broadcastTransaction(unsignedTx, {
        r: addHexPrefix(signature.slice(0, 32).toString('hex')),
        s: addHexPrefix(signature.slice(32, 64).toString('hex')),
        recoveryParam: signature[64],
      })
      .catch(console.log)
      .then(() => true)
  }
}
