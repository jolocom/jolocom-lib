export declare const SEED_PHRASE_LENGTH_LIST: number[];
export declare function sliceSeedPhrase(seedPhrase: string): {
    seed: string;
    encodedDid: string;
};
export declare const shardsToMnemonic: (shards: string[]) => Promise<{
    didPhrase: string;
    seed: string;
}>;
