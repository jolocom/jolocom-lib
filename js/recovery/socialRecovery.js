"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secrets = require("secrets.js-grempe");
const errors_1 = require("../errors");
class SocialRecovery {
    static createShards(did, secret, amount, threshold) {
        did = did.substring(did.lastIndexOf(':') + 1);
        const hexShards = secrets.share(SocialRecovery.pack(did, secret), amount, threshold);
        return hexShards.map(SocialRecovery.compress);
    }
    static validateShard(shard) {
        try {
            secrets.extractShareComponents(SocialRecovery.decompress(shard));
        }
        catch (err) {
            return false;
        }
        return true;
    }
    static combineShard(shards) {
        const result = SocialRecovery.unpack(secrets.combine(shards.map(SocialRecovery.decompress)));
        return {
            did: result.label,
            secret: Buffer.from(result.secret, 'hex'),
        };
    }
    static unpack(shard) {
        const arr = JSON.parse(secrets.hex2str(shard));
        if (arr.length !== 2)
            throw new Error(errors_1.ErrorCodes.RecoveryInvalidSecret);
        return { secret: arr[0], label: arr[1] };
    }
    static pack(label, secret) {
        return secrets.str2hex(JSON.stringify([secret, label]));
    }
    static compress(shard) {
        const shardData = shard.slice(3);
        const shardDataBase64 = Buffer.from(shardData, 'hex').toString('base64');
        return shard.slice(0, 3) + shardDataBase64;
    }
    static decompress(shard) {
        const shardData = shard.slice(3);
        const shardDataHex = Buffer.from(shardData, 'base64').toString('hex');
        return shard.slice(0, 3) + shardDataHex;
    }
}
exports.SocialRecovery = SocialRecovery;
//# sourceMappingURL=socialRecovery.js.map