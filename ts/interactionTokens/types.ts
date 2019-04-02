export interface IJWTHeader {
  alg: string
  typ: string
}

interface IPayload {
  iss?: string
  iat?: number
  typ: string
  [x: string]: any
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: IPayload
  signature: string
}

interface IJWTHeaderAttrs {
  alg: string
  typ: string
}

export enum InteractionType {
  CredentialRequest = 'credentialRequest',
  CredentialResponse = 'credentialResponse',
  CredentialsReceive = 'credentialsReceive',
  Authentication = 'authentication',
  CredentialOffer = 'credentialOffer',
}
