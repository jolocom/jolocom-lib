import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { Authentication } from './authentication'
import {
  IAuthPayloadCreationAttrs,
  IAuthentiactionPayloadAttrs
} from './types'

export class AuthenticationPayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public authentication: Authentication

  public static create(json: IAuthPayloadCreationAttrs): AuthenticationPayload {
    const authPayload = new AuthenticationPayload()
    authPayload.authentication = plainToClass(Authentication, json.authentication)
    authPayload.typ = InteractionType.Authentication

    return authPayload
  }

  public getChallenge(): string {
    return this.authentication.getChallenge()
  }

  public getCallbackURL(): string {
    return this.authentication.getCallbackURL()
  }

  public validateChallenge(attr: AuthenticationPayload): boolean {
    return this.authentication.challenge === attr.getChallenge()
  }

  public getAuthentication(): Authentication {
    return this.authentication
  }

  public static fromJSON(json: IAuthPayloadCreationAttrs): AuthenticationPayload {
    const authPayload = plainToClass(AuthenticationPayload, json)
    authPayload.authentication = plainToClass(Authentication, json.authentication)

    return authPayload
  }

  public toJSON(): IAuthentiactionPayloadAttrs {
    return classToPlain(this) as IAuthentiactionPayloadAttrs
  }
}
