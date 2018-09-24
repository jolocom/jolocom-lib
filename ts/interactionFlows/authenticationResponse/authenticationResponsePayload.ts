import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { AuthenticationResponse } from './authenticationResponse'
import { 
  IAuthenticationResponsePayloadCreationAttrs,
  IAuthentiactionResponsePayloadAttrs,
  IChallengeResponse
} from './types'

export class AuthenticationResponsePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public authResponse: AuthenticationResponse

  public static create(attrs: IAuthenticationResponsePayloadCreationAttrs): AuthenticationResponsePayload {
    const authResponsePayload = new AuthenticationResponsePayload()
    authResponsePayload.authResponse = plainToClass(AuthenticationResponse, attrs.authResponse)
    authResponsePayload.typ = InteractionType.AuthenticationResponse

    return authResponsePayload
  }

// TODO: include possibility to check with available pubKey
  public async validateChallengeResponse(): Promise<boolean> {
      return this.authResponse.validateChallengeResponse()
  }

  public getChallengeResponse(): IChallengeResponse {
    return this.authResponse.challengeResponse
  }

  public static fromJSON(json: IAuthentiactionResponsePayloadAttrs): AuthenticationResponsePayload {
    const authRequestPayload = plainToClass(AuthenticationResponsePayload, json)
    authRequestPayload.authResponse = plainToClass(
      AuthenticationResponse,
      json.authResponse
    )

    return authRequestPayload
  }

  public toJSON(): IAuthentiactionResponsePayloadAttrs {
    return classToPlain(this) as IAuthentiactionResponsePayloadAttrs
  }
}