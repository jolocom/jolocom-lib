import { IDidMethod, Resolver, Registrar } from "../types";
import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { IdentityWallet } from "../../identityWallet/identityWallet";
export declare class JoloDidMethod implements IDidMethod {
    prefix: 'jolo';
    resolver: Resolver;
    registrar: Registrar;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    authenticate(vaultedKeyProvider: IVaultedKeyProvider, password: string): Promise<IdentityWallet>;
}
