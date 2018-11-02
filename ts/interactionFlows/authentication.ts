import { plainToClass, classToPlain, Expose } from 'class-transformer'

/* TODO CLEAN UP */
export interface IAuthenticationAttrs {
  challenge: string
  callbackURL: string
}
export interface IAuthPayloadCreationAttrs {
  iss?: string
  typ: string
  authentication: IAuthenticationAttrs
}

export interface IAuthentiactionPayloadAttrs {
  iat: number
  iss: string
  typ: string
  authentication: IAuthenticationAttrs
}

/*
 * Class representing a challenge string and callback url for challenge-response
 * authentication did authentication, encodable in JWT
 * 
 * Currently unused
 */

@Expose()
export class Authentication {
  private challenge: string
  private callbackURL: string

  public getChallenge(): string {
    return this.challenge
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json: IAuthenticationAttrs): Authentication {
    return plainToClass(this, json)
  }
}
