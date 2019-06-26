import * as secrets from 'secrets.js-grempe'

export class SocialRecovery {
  public static createHorcruxes(
    did: string,
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    const hexString = secrets.str2hex(`${did}:${secret}`)
    return secrets.share(hexString, amount, threshold)
  }

  public static combineHorcurxes(
    horcruxes: string[],
  ): { did: string; secret: string } {
    const result = secrets.hex2str(secrets.combine(horcruxes))
    if (result.indexOf(':') == -1)
      throw new Error('Invalid shards or not enough shards')
    return {
      did: result.split(':')[0],
      secret: result.split(':')[1],
    }
  }
}
