import { IResolver } from '../types';
import { Identity } from '../../identity/identity';
export declare class JolocomResolver implements IResolver {
    prefix: string;
    private resolutionFunctions;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    resolve(did: string): Promise<Identity>;
}
