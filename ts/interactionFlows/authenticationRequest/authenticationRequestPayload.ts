import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { AuthenticationRequest } from './authenticationRequest'
import { 
  IAuthenticationRequestPayloadCreationAttrs,
  IAuthentiactionRequestPayloadAttrs
} from './types'


export class AuthenticationRequestPayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public authRequest: AuthenticationRequest

  public static create(
    json: IAuthenticationRequestPayloadCreationAttrs
    ): AuthenticationRequestPayload {
    
    const authRequestPayload = new AuthenticationRequestPayload()
    authRequestPayload.authRequest = plainToClass(
        AuthenticationRequest,
        json.authRequest
      )
    authRequestPayload.typ = InteractionType.AuthenticationRequest

    return authRequestPayload
  }

  public getChallenge(): string {
    return this.authRequest.getChallenge()
  }

  public getCallbackURL(): string {
    return this.authRequest.getCallbackURL()
  }

  public static fromJSON(
    json: IAuthentiactionRequestPayloadAttrs
    ): AuthenticationRequestPayload {
    const authRequestPayload = plainToClass(AuthenticationRequestPayload, json)
    authRequestPayload.authRequest = plainToClass(
      AuthenticationRequest,
      json.authRequest
    )

    return authRequestPayload
  }

  public toJSON(): IAuthentiactionRequestPayloadAttrs {
    return classToPlain(this) as IAuthentiactionRequestPayloadAttrs
  }
}
