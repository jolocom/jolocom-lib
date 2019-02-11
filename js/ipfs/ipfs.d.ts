import { IIpfsConnector, IIpfsConfig } from './types';
export declare class IpfsStorageAgent implements IIpfsConnector {
    private _endpoint;
    private _fetchImplementation;
    constructor(config: IIpfsConfig);
    readonly endpoint: string;
    fetchImplementation: typeof window.fetch;
    storeJSON({ data, pin }: {
        data: object;
        pin: boolean;
    }): Promise<string>;
    catJSON(hash: string): Promise<object>;
    removePinnedHash(hash: string): Promise<void>;
    private postRequest;
    private getRequest;
    private serializeJSON;
}
export declare const jolocomIpfsStorageAgent: IpfsStorageAgent;
