import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";

// Does using T in encounter and updatePublicProfile conflate two unrelated things?
export interface Registrar <T, U> {
  prefix: string
  encounter: (change: T) => Promise<boolean>
  create: (keyProvider: IVaultedKeyProvider, password: string, creationConfig?: U) => Promise<T>
// TODO Should this return a boolean or rather an idenitity?
  updatePublicProfile: (keyProvider: IVaultedKeyProvider, password: string, identity: T, publicProfile: object) => Promise<boolean> 
}


