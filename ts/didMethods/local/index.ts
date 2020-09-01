import { IDidMethod, IResolver, IRegistrar } from '../types'
import { LocalRegistrar } from './registrar'
import { LocalResolver } from './resolver'
import { InternalDb, createDb } from 'local-resolver-registrar/js/db'
import { validateEvents, walletUtils } from '@jolocom/native-core'
import { authAsIdentityFromKeyProvider } from '../utils'
import { recoverJunKeyProviderFromSeed } from './recovery'

export class LocalDidMethod implements IDidMethod {
  public prefix = 'jun'
  public resolver: IResolver
  public registrar: IRegistrar
  private db: InternalDb // TODO Rename type InternalDb

  constructor(
    db = createDb(), // TODO Alternative to in-memory map?
  ) {
    this.resolver = new LocalResolver(db, validateEvents)
    this.registrar = new LocalRegistrar(db)
  }

  public async recoverFromSeed(seed: Buffer, newPassword: string) {
    const { keyProvider, inceptionEvent } = await recoverJunKeyProviderFromSeed(
      seed,
      newPassword,
      walletUtils,
    )

    await this.registrar.encounter(inceptionEvent)

    return {
      identityWallet: await authAsIdentityFromKeyProvider(
        keyProvider,
        newPassword,
        this.resolver,
      ),
      succesfullyResolved: true,
    }
  }
}
