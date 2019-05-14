import * as secrets from 'secrets.js-grempe'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { createJolocomRegistry } from '../registries/jolocomRegistry'

export class SocialRecovery {
  public static createHorcruxes(
    secret: string,
    amount: number,
    threshold: number,
  ): string[] {
    const vkp = new SoftwareKeyProvider(Buffer.from(secret), 'password')
    const registry = createJolocomRegistry()

    return secrets.share(secret, amount, threshold)
  }

  public static combineHorcurxes(horcruxes: string[]): string {
    return secrets.combine(horcruxes)
  }
}
