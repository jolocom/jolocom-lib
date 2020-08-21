import { Identity } from "../../identity/identity";
import { getRegistry } from 'jolo-did-registry';
import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { SignedCredential } from "../../credentials/signedCredential/signedCredential";
import { IRegistrar } from "../types";
export declare class JolocomRegistrar implements IRegistrar {
    prefix: string;
    registry: ReturnType<typeof getRegistry>;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(keyProvider: IVaultedKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: IVaultedKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(): Promise<boolean>;
    private signDidDocument;
    private update;
}
