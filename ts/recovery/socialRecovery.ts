import * as secrets from 'secrets.js-grempe'
import { entropyToMnemonic } from 'bip39'
import { ErrorCodes } from '../errors'

export class SocialRecovery {
  public static createShards(
    did: string,
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    did = did.substring(did.lastIndexOf(':') + 1)
    const hexShards = secrets.share(
      SocialRecovery.pack(did, secret),
      amount,
      threshold,
    )
    return hexShards.map(SocialRecovery.compress)
  }

  public static validateShard(shard: string): any {
    try {
      secrets.extractShareComponents(SocialRecovery.decompress(shard))
    } catch (err) {
      return false
    }
    return true
  }

  public static combineShard(
    shards: string[],
  ): { did: string; secret: Buffer } {
    const result = SocialRecovery.unpack(
      secrets.combine(shards.map(SocialRecovery.decompress)),
    )

    return {
      did: result.label,
      secret: Buffer.from(result.secret, 'hex'),
    }
  }
  private static unpack(shard: string): { secret: string; label: string } {
    const arr = JSON.parse(secrets.hex2str(shard))
    if (arr.length !== 2) throw new Error(ErrorCodes.RecoveryInvalidSecret)

    return { secret: arr[0], label: arr[1] }
  }
  private static pack(label: string, secret: string): string {
    return secrets.str2hex(JSON.stringify([secret, label]))
  }

  private static compress(shard) {
    const shardData = shard.slice(3)
    const shardDataBase64 = Buffer.from(shardData, 'hex').toString('base64')
    return shard.slice(0, 3) + shardDataBase64
  }

  private static decompress(shard) {
    const shardData = shard.slice(3)
    const shardDataHex = Buffer.from(shardData, 'base64').toString('hex')
    return shard.slice(0, 3) + shardDataHex
  }
}
