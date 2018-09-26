export interface IAuthentiactionResponsePayloadAttrs {
    iat: number
    iss: string
    typ: string
    authResponse: IAuthenticationResponseAttrs 
  }
  
  export interface IAuthenticationResponsePayloadCreationAttrs {
    typ: string
    authResponse: IAuthenticationResponseAttrs
  }
  
  export interface IAuthenticationResponseAttrs {
    challengeResponse: IChallengeResponse
  }

  export interface IChallengeResponse {
    did: string
    signedChallenge: string
  }