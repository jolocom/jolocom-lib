export interface IAuthentiactionRequestPayloadAttrs {
  iat: number
  iss: string
  typ: string
  authRequest: IAuthenticationRequestAttrs 
}

export interface IAuthenticationRequestPayloadCreationAttrs {
  typ: string
  authRequest: IAuthenticationRequestAttrs
}

export interface IAuthenticationRequestAttrs {
  challenge: string
  callbackURL: string
}
