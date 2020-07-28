import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { IdentityWallet } from "../../identityWallet/identityWallet";
import { Resolver, Registrar } from "../types";
export declare const createJoloIdentity: (vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string, registrar: Registrar) => Promise<IdentityWallet>;
export declare const authJoloIdentity: (vkp: IVaultedKeyProvider, password: string, resolver: Resolver) => Promise<IdentityWallet>;
