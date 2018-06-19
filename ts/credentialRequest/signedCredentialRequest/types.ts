import { CredentialRequest } from '../credentialRequest';

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface ISignedCredentialRequestAttrs {
  header: IJWTHeader
  payload: {
    iat: number
    iss: string
    callbackURL: string
    credentialRequest: CredentialRequest
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
