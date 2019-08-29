export declare class SocialRecovery {
    static createShards(did: string, secret: string, amount: number, threshold: number): string[];
    static validateShard(shards: string): any;
    static combineShard(shards: string[]): {
        did: string;
        secret: string;
    };
}
