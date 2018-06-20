import { IJWTHeader } from '../../credentialRequest/signedCredentialRequest/types'
import { CredentialResponse } from '../credentialResponse'
import { ICredentialResponseAttrs } from '../types';

export interface ISignedCredentialResponseAttrs {
  header: IJWTHeader
  payload: {
    credentialResponse: ICredentialResponseAttrs
    iss: string
    iat: number
  }
  signature: string
}

export interface ISignedCredResponsePayload {
  iat: number | null
  iss: string | null
  credentialResponse: CredentialResponse | null
}

export interface ISignedCredResponseCreationArgs {
  credentialResponse: CredentialResponse
  privateKey: Buffer
  issuer?: string
}
