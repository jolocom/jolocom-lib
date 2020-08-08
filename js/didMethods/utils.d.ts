import { SoftwareKeyProvider } from "@jolocom/vaulted-key-provider";
import { IdentityWallet } from "../identityWallet/identityWallet";
import { IResolver, IRegistrar } from "./types";
export declare const createIdentityFromKeyProvider: (vaultedKeyProvider: SoftwareKeyProvider, decryptionPassword: string, registrar: IRegistrar) => Promise<IdentityWallet>;
export declare const authAsIdentityFromKeyProvider: (vkp: SoftwareKeyProvider, resolver: IResolver) => Promise<IdentityWallet>;
