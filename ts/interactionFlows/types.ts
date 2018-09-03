import { JSONWebToken } from './jsonWebToken';
import { IJWTHeader, ISignedCredentialRequestAttrs } from '../credentialRequest/signedCredentialRequest/types';

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
  payload: IPayload
}

export interface IPayloadAttrs {
  iss: string
  iat: number
  typ: string
}

export interface IJSONWebTokenAttrs {
  header: IJWTHeaderAttrs
  payload: IPayloadAttrs
  signature: string
}

export interface IJWTHeaderAttrs {
  alg: string
  typ: string
}

export enum InteractionType {
  credentialRequest,
  credentialResponse,
  credentialsReceiving
}
