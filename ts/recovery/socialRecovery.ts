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

  public static validateShard(horcurx: string): any {
    return validateShard(horcurx, darkCrystalVersion)
  }

  public static combineShard(
    horcruxes: string[],
  ): { did: string; secret: string } {
    const result = unpack(
      combine(horcruxes, darkCrystalVersion),
      darkCrystalVersion,
    )

    return {
      did: 'did:jolo:' + result.label,
      secret: result.secret,
    }
  }
}
