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
  
  export interface IAuthenticationResponseCreationAttrs {
    challenge: string
    did: string
    keyId: string
    privKey: Buffer
  }

  export interface IAuthenticationResponseAttrs {
    challengeResponse: IChallengeResponse
  }

  export interface IChallengeResponse {
    challenge: string
    did: string
    keyId: string
    signatureValue: string
  }