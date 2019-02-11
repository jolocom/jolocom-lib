import { IEthereumResolverConfig, IEthereumConnector, IEthereumResolverUpdateDIDArgs } from './types';
export declare class EthResolver implements IEthereumConnector {
    private ethResolver;
    constructor(config: IEthereumResolverConfig);
    resolveDID(did: string): Promise<string>;
    updateDIDRecord({ ethereumKey, did, newHash }: IEthereumResolverUpdateDIDArgs): Promise<void>;
}
export declare const jolocomEthereumResolver: EthResolver;
