import { IResolver } from '../types';
import { Identity } from '../../identity/identity';
export declare class JolocomResolver implements IResolver {
    private _prefix;
    private resolutionFunctions;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string, prefix?: string);
    readonly prefix: string;
    resolve(did: string): Promise<Identity>;
}
