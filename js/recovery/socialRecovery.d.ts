export declare class SocialRecovery {
    static createShards(did: string, secret: string, amount: number, threshold: number): string[];
    static validateShard(shard: string): any;
    static combineShard(shards: string[]): {
        did: string;
        secret: string;
    };
    private static unpack;
    private static pack;
    private static compress;
    private static decompress;
}
