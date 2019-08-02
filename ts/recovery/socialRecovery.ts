import {
  pack,
  unpack,
  share,
  validateShard,
  combine,
} from 'dark-crystal-secrets'

const darkCrystalVersion = '2.0.0'

export class SocialRecovery {
  public static createShards(
    did: string,
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    did = did.substring(did.lastIndexOf(':') + 1)
    const labeledSecret = pack(secret, did)
    return share(labeledSecret, amount, threshold)
  }

  public static validateShard(shards: string): any {
    return validateShard(shards, darkCrystalVersion)
  }

  public static combineShard(
    shards: string[],
  ): { did: string; secret: string } {
    const result = unpack(
      combine(shards, darkCrystalVersion),
      darkCrystalVersion,
    )

    return {
      did: 'did:jolo:' + result.label,
      secret: result.secret,
    }
  }
}