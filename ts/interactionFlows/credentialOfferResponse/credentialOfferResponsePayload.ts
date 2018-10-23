import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass, Type } from 'class-transformer'
import { ICredentialOfferResPayloadCreationAttrs } from './types'
import { CredentialOffer } from '../credentialOfferRequest/credentialOffer'

export class CredentialOfferResponsePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType

  // TODO MIGHT BREAK THINGS
  @Type(() => CredentialOffer)
  public credentialOffer: CredentialOffer

  public static create(attrs: ICredentialOfferResPayloadCreationAttrs): CredentialOfferResponsePayload {
    const credOfferPayload = new CredentialOfferResponsePayload()
    // TODO MIGHT BREAK THINGS
    const { iss, credentialOffer } = attrs

    credOfferPayload.credentialOffer = plainToClass(CredentialOffer, credentialOffer)
    credOfferPayload.typ = InteractionType.CredentialOfferResponse

    if (iss) {
      credOfferPayload.iss = iss
    }

    return credOfferPayload
  }

  public isInstant(): boolean {
    return this.credentialOffer.isInstant()
  }

  public getRequestedInput(): { [key: string]: string | undefined } {
    return this.credentialOffer.getRequestedInput()
  }

  public getChallenge(): string {
    return this.credentialOffer.getChallenge()
  }

  public getCallbackURL(): string {
    return this.credentialOffer.getCallbackURL()
  }

  public static fromJSON(json: ICredentialOfferResPayloadCreationAttrs): CredentialOfferResponsePayload {
    return plainToClass(CredentialOfferResponsePayload, json)
  }

  public toJSON(): ICredentialOfferResPayloadCreationAttrs {
    return classToPlain(this) as ICredentialOfferResPayloadCreationAttrs
  }
}