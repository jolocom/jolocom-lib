import { Identity } from '../../identity/identity'
import { getRegistrar } from 'local-resolver-registrar'
import { DidDocument } from '../../identity/didDocument/didDocument'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { createDb } from 'local-resolver-registrar/js/db'
import { getIdFromEvent, validateEvents, getIcp } from '@jolocom/native-core'
import { SoftwareKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'

interface CreationReturn {
  id: string
  encryptedWallet: string
  inceptionEvent: string
}

export class LocalRegistrar implements IRegistrar {
  public prefix = 'jun'
  private registrar: ReturnType<typeof getRegistrar>

  public constructor(db = createDb()) {
    this.registrar = getRegistrar({
      dbInstance: db,
      create: getIcp,
      getIdFromEvent: getIdFromEvent,
      validateEvents: validateEvents,
    })
  }

  public async create(keyProvider: SoftwareKeyProvider, password: string) {
    const ret = (await this.registrar.create({
      encryptedWallet: keyProvider.encryptedWallet,
      id: keyProvider.id,
      pass: password,
    })) as CreationReturn

    // @ts-ignore Assigning directly to a private property
    keyProvider._encryptedWallet = Buffer.from(ret.encryptedWallet, 'base64')
    // @ts-ignore Assigning directly to a private property
    keyProvider._id = ret.id

    // TODO This should be implemented in terms of delegated inception
    await keyProvider.newKeyPair(
      password,
      KeyTypes.x25519KeyAgreementKey2019
    )

    const didDoc = JSON.parse(
      await validateEvents(JSON.stringify([ret.inceptionEvent])),
    )

    const identity = Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDoc),
    })

    await this.encounter([ret.inceptionEvent])
    return identity
  }

  // TODO Verify signature on the public profile? Or just assume it's correct
  // TODO Public profile should perhaps be JSON / any, so that the registrars can be used without having to typecheck / guard / use generics
  public async updatePublicProfile(
    keyProvider: SoftwareKeyProvider,
    password: string,
    identity: Identity,
    publicProfile: SignedCredential,
  ) {
    console.error(`"updatePublicProfile not implemented for did:${this.prefix}`) // TODO Better error
    return false
  }

  public async encounter(deltas: string[]) {
    const didDocJson = JSON.parse(await this.registrar.update(deltas))
    return Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDocJson),
    })
  }
}
