export interface IAuthenticationAttrs {
  challenge: string
  callbackURL: string
}

export interface IAuthPayloadCreationAttrs {
  typ: string
  authentication: IAuthenticationAttrs
}

export interface IAuthentiactionPayloadAttrs {
  iat: number
  iss: string
  typ: string
  authentication: IAuthenticationAttrs 
}
