import { JSONWebToken } from './jsonWebToken';
import { IJWTHeader, ISignedCredentialRequestAttrs } from '../credentialRequest/signedCredentialRequest/types';
import { SignedCredentialRequestPayload } from './signedCredentialRequest/signedCredentialRequestPayload';
import { ISignedCredRequestPayloadAttrs } from './signedCredentialRequest/types';

export type InteractionTypePayloadAttrs = ISignedCredRequestPayloadAttrs

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
