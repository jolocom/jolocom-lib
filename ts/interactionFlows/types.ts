import { ICredentialRequestPayloadCreationAttrs, ICredentialRequestPayloadAttrs } from './credentialRequest/types'
import { IPrivateKeyWithId } from '../identityWallet/types'
import { ICredentialResponsePayloadCreationAttrs, ICredentialResponsePayloadAttrs } from './credentialResponse/types';

export type InteractionTypePayloadCreationAttrs =
  ICredentialRequestPayloadCreationAttrs |
  ICredentialResponsePayloadCreationAttrs

export type InteractionTypePayloadAttrs =
  ICredentialRequestPayloadAttrs |
  ICredentialResponsePayloadAttrs

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface IPayload {
  iss?: string
  iat?: number
  typ: InteractionType
  [x: string]: any
}

export interface IPayloadCreation {
  typ: InteractionType
  [x: string]: any
}

export interface IJSONWebTokenCreationAttrs {
  privateKey: IPrivateKeyWithId
  payload: IPayloadCreation
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: IPayload
  signature: string
}

export interface IPayloadAttrs {
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
  CredentialsReceiving = 'credentialsReceiving'
}
