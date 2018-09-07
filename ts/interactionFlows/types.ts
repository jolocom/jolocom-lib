import { CredentialRequestPayload } from './credentialRequest/credentialRequestPayload';
import { ICredentialRequestPayloadAttrs } from './credentialRequest/types';

export type InteractionTypePayloadAttrs = ICredentialRequestPayloadAttrs
export type InteractionTypePayloads = CredentialRequestPayload

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
  privateKey: Buffer
  payload: InteractionTypePayloadAttrs
}

export interface IPayloadAttrs {
  iss: string
  iat: number
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