import { CredentialResponse } from '../credentialResponse'
import { ICredentialResponseAttrs } from '../types';
import { IJWTHeader } from '../../interactionFlows/types';

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
  iat: number
  iss: string
  credentialResponse: CredentialResponse
}

export interface ISignedCredResponseCreationArgs {
  credentialResponse: CredentialResponse
  privateKey: Buffer
  issuer?: string
}
