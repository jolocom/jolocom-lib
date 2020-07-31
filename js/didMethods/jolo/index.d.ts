import { IDidMethod, IResolver, IRegistrar } from "../types";
export declare class JoloDidMethod implements IDidMethod {
    prefix: 'jolo';
    resolver: IResolver;
    registrar: IRegistrar;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
}
