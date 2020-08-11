import { Identity } from '../../identity/identity'
import { getRegistrar } from 'local-did-resolver'
import { DidDocument } from '../../identity/didDocument/didDocument'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'
import { IRegistrar } from '../types'
import { createDb } from 'local-did-resolver/js/db'
import {
  getIdFromEvent,
  validateEvents,
  getIcp,
} from '@jolocom/native-utils-node'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

type CreationReturn = {
  id: string
  encryptedWallet: string
  inceptionEvent: string
}

type CreationParams = { id: string; encryptedWallet: string; pass: string }

const createFromIcp = async (p: CreationParams): Promise<CreationReturn> =>
  JSON.parse(await getIcp(p.encryptedWallet, p.id, p.pass)) as CreationReturn

export class LocalRegistrar implements IRegistrar {
  public prefix = 'un'
  private registrar: ReturnType<typeof getRegistrar>

  constructor(db = createDb()) {
    this.registrar = getRegistrar({
      dbInstance: db,
      create: createFromIcp,
      getIdFromEvent: getIdFromEvent,
      validateEvents: validateEvents,
    })
  }

  async create(keyProvider: SoftwareKeyProvider, password: string) {
    const ret = (await this.registrar.create({
      encryptedWallet: keyProvider.encryptedWallet,
      id: keyProvider.id,
      pass: password,
    })) as CreationReturn

    // @ts-ignore Assigning directly to a private property
    keyProvider._encryptedWallet = Buffer.from(ret.encryptedWallet, 'base64')
    // @ts-ignore Assigning directly to a private property
    keyProvider._id = ret.id

    const didDoc = JSON.parse(
      await validateEvents(JSON.stringify([ret.inceptionEvent]))
    )

    const identity = Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDoc),
    })

    this.encounter(ret.inceptionEvent)
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
    console.error(`"updatePublicProfile not implemented for did:${this.prefix}`) // TODO Better error
    return false
  }

  async encounter(delta: string) {
    await this.registrar.update([delta]).catch((e: Error) => {
      console.error(e)
      return false
    }) // TODO This needs to return bool?
    return true
  }
}
