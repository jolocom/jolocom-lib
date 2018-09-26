import { IPrivateKeyWithId } from '../identityWallet/types'

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface IPayload {
  iss?: string
  iat?: number
  typ: string
  [x: string]: any
}

export interface IJSONWebTokenCreationAttrs {
  privateKey: IPrivateKeyWithId
  payload: IPayloadCreationAttrs
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: IPayload
  signature: string
}

export interface IPayloadCreationAttrs {
  typ: string
  [x: string]: any
}

export interface IJWTHeaderAttrs {
  alg: string
  typ: string
}

export enum InteractionType {
  CredentialRequest = 'credentialRequest',
  CredentialResponse = 'credentialResponse',
  CredentialsReceiving = 'credentialsReceiving',
  AuthenticationResponse = 'authenticationResponse',
  AuthenticationRequest = 'authenticationRequest',
  CredentialsReceive = 'credentialsReceive'
}
