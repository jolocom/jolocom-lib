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
  public prefix = 'jolo'
  private registrar: ReturnType<typeof getRegistrar>

  constructor(db = createDb()) {
    this.registrar = getRegistrar({
      dbInstance: db,
      create: createFromIcp,
      getIdFromEvent: getIdFromEvent,
      validateEvents: validateEvents,
    })
  }

  // TODO KERI Must give us a createICP function, and a convertToDidDoc function
  // otherwise there's no way to update the registrar with the ICP created from
  // this.registrar.create(), and no way to resolve ourselves
  async create(keyProvider: SoftwareKeyProvider, password: string) {
    /*
     * potential eventual API:
     * const icp = await this.registrar.create()
     * this.db.append(icp)
     * return this.registrar.valdateEvents(icp)
     */

    // TODO currently contains keys as well.
    const ret = (await this.registrar.create({
      encryptedWallet: keyProvider.encryptedWallet,
      id: keyProvider.id,
      pass: password,
    })) as CreationReturn

    // @ts-ignore
    keyProvider._encryptedWallet = Buffer.from(ret.encryptedWallet, 'base64')

    const identity = Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(
        JSON.parse(await validateEvents(JSON.stringify[ret.inceptionEvent])), // TODO A better way? Perhaps didMethod.resolvelve(ourDid), but no resolver ref here :(
      ),
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
