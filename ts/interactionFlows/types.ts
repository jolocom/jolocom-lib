import { ICredentialRequestPayloadCreationAttrs } from './credentialRequest/types'
import { IPrivateKeyWithId } from '../identityWallet/types'

export type InteractionTypePayloadAttrs = ICredentialRequestPayloadCreationAttrs

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface IPayload {
  iss: string
  iat: number
  typ: InteractionType
  [x: string]: any
}

export interface IJSONWebTokenCreationAttrs {
  privateKey: IPrivateKeyWithId
  payload: InteractionTypePayloadAttrs
}

export interface IPayloadAttrs {
  typ: string
  [x: string]: any
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: InteractionTypePayloadAttrs
  signature: string
}

export interface IJWTHeaderAttrs {
  alg: string
  typ: string
}

export enum InteractionType {
  CredentialRequest = 'credentialRequest',
  CredentialResponse = 'credentialResponse',
  CredentialsReceiving = 'credentialsReceiving'
}
