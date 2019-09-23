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
  header: IJWTHeader
  payload: IPayload
  signature: string
}

export enum InteractionType {
  CredentialRequest = 'credentialRequest',
  CredentialResponse = 'credentialResponse',
  CredentialsReceive = 'credentialsReceive',
  Authentication = 'authentication',
  CredentialOfferRequest = 'credentialOfferRequest',
  CredentialOfferResponse = 'credentialOfferResponse',
  PaymentRequest = 'paymentRequest',
  PaymentResponse = 'paymentResponse',
}
