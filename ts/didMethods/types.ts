import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { Identity } from "../identity/identity";

/*
 * TODO - is the prefix required on all components, or just the DID Method?
 * probably keep for all, because then the register / resolver can make sure the results are from the right did method
 * 
 * Replace the generic type T with any / string / object? Not sure if having it generic helps
 */

// TODO 
export interface IRegistrar {
  prefix: string
  encounter: (change: string) => Promise<boolean>
  create: <T>(keyProvider: IVaultedKeyProvider, password: string, creationConfig?: T) => Promise<Identity>
  updatePublicProfile: (keyProvider: IVaultedKeyProvider, password: string, identity: Identity, publicProfile: any) => Promise<boolean> 
}

export interface IResolver {
  prefix: string
  resolve: (did: string) => Promise<Identity>
}

export interface IDidMethod {
  prefix: string
  resolver: IResolver,
  registrar: IRegistrar
}
