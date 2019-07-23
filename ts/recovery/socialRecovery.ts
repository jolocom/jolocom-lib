import {
  pack,
  unpack,
  share,
  validateShard,
  combine,
} from 'dark-crystal-secrets'

const darkCrystalVersion = '2.0.0'

export class SocialRecovery {
  public static createHorcruxes(
    did: string,
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    const labeledSecret = pack(secret, did)
    return share(labeledSecret, amount, threshold)
  }

  public static validateHorcrux(horcurx: string): any {
    return validateShard(horcurx, darkCrystalVersion)
  }

  public static combineHorcurxes(
    horcruxes: string[],
  ): { did: string; secret: string } {
    const result = unpack(
      combine(horcruxes, darkCrystalVersion),
      darkCrystalVersion,
    )

    return {
      did: result.label,
      secret: result.secret,
    }
  }
}
