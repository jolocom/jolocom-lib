import { Resolver } from "../types";
import { Identity } from "../../identity/identity";
export declare class JolocomResolver implements Resolver {
    prefix: 'jolo';
    private resolutionFunctions;
    constructor(providerUrl: string, contractAddress: string, ipfsHost: string);
    resolve(did: string): Promise<Identity>;
}
