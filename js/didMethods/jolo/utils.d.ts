import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { IdentityWallet } from "../../identityWallet/identityWallet";
import { IResolver, IRegistrar } from "../types";
export declare const createJoloIdentity: (vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string, registrar: IRegistrar) => Promise<IdentityWallet>;
export declare const authJoloIdentity: (vkp: IVaultedKeyProvider, password: string, resolver: IResolver) => Promise<IdentityWallet>;
