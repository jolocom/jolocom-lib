import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { ICredentialOfferAttrs } from './interactionTokens.types'

/* Class representing a credential offer. Encodable in JWT */

@Exclude()
export class CredentialOffer {
  @Expose()
  private callbackURL: string

  @Expose()
  private instant: boolean

  @Expose()
  private requestedInput: {
    [key: string]: string | null
  }

  public isInstant(): boolean {
    return this.instant
  }

  public getRequestedInput(): { [key: string]: string | undefined } {
    return this.requestedInput
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json: ICredentialOfferAttrs) {
    return plainToClass(this, json) as CredentialOffer
  }
}
