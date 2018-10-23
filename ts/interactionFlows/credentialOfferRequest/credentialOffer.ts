import { plainToClass, classToPlain } from 'class-transformer'

interface OfferCreationAttrs {
  challenge: string
  callbackUrl: string
  instant: boolean
  requestedInput: {
    [key: string]: string | null
  }
}

export class CredentialOffer {
  private challenge: string
  private callbackURL: string
  private instant: boolean
  private requestedInput: {
    [key: string]: string | null
  }

  public static create(attrs: OfferCreationAttrs): CredentialOffer {
    const offer = new CredentialOffer()
    const { challenge, callbackUrl, instant, requestedInput } = attrs

    offer.challenge = challenge
    offer.callbackURL = callbackUrl
    offer.instant = instant
    offer.requestedInput = requestedInput

    return offer
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

  public static fromJSON(json) {
    return plainToClass(CredentialOffer, json)
  }
}
