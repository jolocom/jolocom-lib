/// <reference types="node" />
export interface IEthereumResolverConfig {
    providerUrl: string;
    contractAddress: string;
}
export interface IEthereumResolverUpdateDIDArgs {
    ethereumKey: Buffer;
    did: string;
    newHash: string;
}
export interface IEthereumConnector {
    resolveDID: (did: string) => Promise<string>;
    updateDIDRecord: (args: IEthereumResolverUpdateDIDArgs) => Promise<void>;
}
