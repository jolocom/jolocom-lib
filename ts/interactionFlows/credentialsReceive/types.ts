import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export interface ICredentialsReceivePayloadCreationAttrs {
  iss?: string
  typ: string
  credentialsReceive: ICredentialsReceiveAttrs
}

export interface ICredentialsReceiveAttrs {
  signedCredentials: ISignedCredentialAttrs[]
}

export interface ICredentialsReceivePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialsReceive: ICredentialsReceiveAttrs
}
