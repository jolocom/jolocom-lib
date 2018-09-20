import { plainToClass, classToPlain } from 'class-transformer'
import { IAuthenticationResponseAttrs, IChallengeResponse } from './types'

export class AuthenticationResponse {
  public challengeResponse: IChallengeResponse

  public static create(attrs: IAuthenticationResponseAttrs): AuthenticationResponse {
    const authResponse = new AuthenticationResponse()
    authResponse.challengeResponse = attrs.challengeResponse

    return authResponse
  }

  public async validateChallengeResponse(): Promise<boolean> {
    // TODO implement when registry method is ready
    return false
  }

  public getChallengeResponse(): IChallengeResponse {
    return this.challengeResponse
  }

  public toJSON(): IAuthenticationResponseAttrs {
    return classToPlain(this) as IAuthenticationResponseAttrs
  }

  public static fromJSON(json: IAuthenticationResponseAttrs): AuthenticationResponse {
    return plainToClass(AuthenticationResponse, json)
  }
}