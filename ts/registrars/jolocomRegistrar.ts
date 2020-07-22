import { Identity } from "../identity/identity"
import { getRegistry, infura, jolocomIpfsHost, jolocomContract } from 'jolo-did-registry'
import { IVaultedKeyProvider, KeyTypes } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider"
import { DidDocument } from "../identity/didDocument/didDocument"
import { ServiceEndpointsSection } from "../identity/didDocument/sections"
import { fuelKeyWithEther } from "../utils/helper"
import { Registrar } from "./types"
import { SignedCredential } from "../credentials/signedCredential/signedCredential"

export class JolocomRegistrar implements Registrar<Identity, {}> {
  public prefix = 'jolo'
  public registry: ReturnType<typeof getRegistry> 

  constructor(providerUrl = infura, contractAddress = jolocomContract, ipfsHost= jolocomIpfsHost) {
    this.registry = getRegistry(providerUrl, contractAddress, ipfsHost)
  }

  async create(keyProvider: IVaultedKeyProvider, password: string) {
    const identityKey = keyProvider.getPublicKey({
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: password
    })

    const identity = Identity.fromDidDocument({
      didDocument: await DidDocument.fromPublicKey(identityKey)
    })

    await this.signDidDocument(
      identity.didDocument,
      keyProvider,
      password
    )

    await this.update(
      keyProvider,
      password,
      identity.didDocument
    )

    return identity
  }

  // TODO Verify signature on the public profile? Or just assume it's correct
  async updatePublicProfile(keyProvider: IVaultedKeyProvider, password: string, identity: Identity, credential: SignedCredential) {
    const { didDocument } = identity

    const publicProfileEntry = ServiceEndpointsSection.fromJSON(
      await this.registry.publishPublicProfile(identity.did, credential)
    )

    const oldPublicProfileEntry = didDocument.service.findIndex(
      ({type}) => type === 'JolocomPublicProfile'
    )

    if (oldPublicProfileEntry !== -1) {
      didDocument.service.splice(oldPublicProfileEntry, 1, publicProfileEntry)
    } else {
      didDocument.addServiceEndpoint(publicProfileEntry)
    }

    identity.publicProfile = credential

    await this.signDidDocument(
      didDocument,
      keyProvider,
      password
    )

    return this.update(keyProvider, password, didDocument).then(() => true)
  }

  async encounter() {
    console.error(`"encounter" not implemented for did:${this.prefix}`) // TODO Better error
    return false
  }

  private async signDidDocument(didDocument: DidDocument, keyProvider: IVaultedKeyProvider, password: string) {
    didDocument.hasBeenUpdated()
    return didDocument.sign(
      keyProvider,
      {
        derivationPath: KeyTypes.jolocomIdentityKey,
        encryptionPass: password
      }
    )
  }

  private async update(keyProvider: IVaultedKeyProvider, password: string, didDocument: DidDocument) {
    // Essentialy sign_raw with the encoded TX kinda, not really, this is Recoverable signature
    const ethSecretKey = keyProvider.getPrivateKey({
      derivationPath: KeyTypes.ethereumKey,
      encryptionPass: password
    })

    const ethPublicKey = keyProvider.getPublicKey({
      derivationPath: KeyTypes.ethereumKey,
      encryptionPass: password
    })

    await fuelKeyWithEther(ethPublicKey)

    return this.registry.commitDidDoc(
      ethSecretKey,
      //@ts-ignore TODO
      didDocument.toJSON(),
    )
  }
}

