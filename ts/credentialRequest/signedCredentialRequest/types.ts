import { CredentialRequest } from '../credentialRequest';
import { ICredentialRequestAttrs } from '../types';

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface ISignedCredentialRequestAttrs {
  header: IJWTHeader
  payload: {
    iat: number
    iss: string
    credentialRequest: ICredentialRequestAttrs
  }
  signature: string
}

export interface ISignedCredRequestPayload {
  iat: number | null
  iss: string | null
  credentialRequest: CredentialRequest | null
}

export interface ISignedCredRequestCreationArgs {
  credentialRequest: CredentialRequest
  privateKey: Buffer
  issuer?: string
}
