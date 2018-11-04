import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { ICredentialOfferCreationAttrs } from './credentialOfferTypes';

/* Class representing a credential offer. Encodable in JWT */

@Exclude()
export class CredentialOffer {
  @Expose()
  private challenge: string

  @Expose()
  private callbackURL: string

  @Expose()
  private instant: boolean

  @Expose()
  private requestedInput: {
    [key: string]: string | null
  }

  public getChallenge(): string {
    return this.challenge
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

  public static fromJSON(json: ICredentialOfferCreationAttrs) {
    return plainToClass(this, json) as CredentialOffer
  }
}
