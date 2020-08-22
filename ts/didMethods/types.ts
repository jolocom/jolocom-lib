import { Identity } from '../identity/identity'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

/*
 * TODO - is the prefix required on all components, or just the DID Method?
 * probably keep for all, because then the register / resolver can make sure the results are from the right did method
 *
 * Replace the generic type T with any / string / object? Not sure if having it generic helps
 */

// TODO
export interface IRegistrar {
  prefix: string
  encounter: (events: [string]) => Promise<Identity>
  create: <T>(
    keyProvider: SoftwareKeyProvider,
    password: string,
    creationConfig?: T,
  ) => Promise<Identity>
  updatePublicProfile: (
    keyProvider: SoftwareKeyProvider,
    password: string,
    identity: Identity,
    publicProfile: any,
  ) => Promise<boolean>
}

export interface IResolver {
  prefix: string
  resolve: (did: string) => Promise<Identity>
}

export interface IDidMethod {
  prefix: string
  resolver: IResolver
  registrar: IRegistrar
}
