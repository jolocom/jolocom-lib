import * as secrets from 'secrets.js-grempe'

export class SocialRecovery {
  public static createHorcruxes(
    did: string,
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    const hexString = `${did}${secret}`
    return secrets.share(hexString, amount, threshold)
  }

  public static combineHorcurxes(
    horcruxes: string[],
  ): { did: string; secret: string } {
    const result = secrets.combine(horcruxes)

    return {
      // did: result.split(hexColon)[0],
      // secret: result.split(hexColon)[1],
      did: result.slice(0, 64),
      secret: result.slice(64),
    }
  }
}
