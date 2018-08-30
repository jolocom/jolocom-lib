import { JSONWebToken } from './jsonWebToken';
import { IJWTHeader } from '../credentialRequest/signedCredentialRequest/types';

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface IPayload {
  iss: string
  iat: number
  typ: InteractionType

  toJSON(): any
  fromJSON(): IPayload
  // valid?(): boolean // so that we could use it in toJWT()
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
  sso,
  credentials_receiving
}
