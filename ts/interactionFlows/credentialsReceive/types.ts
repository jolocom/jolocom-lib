import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export interface ICredentialsReceivePayloadCreationAttrs {
  typ: string
  credentialsReceive: ICredentialsReceiveAttrs
}

export interface ICredentialsReceiveAttrs {
  signedCredentials: SignedCredential[]
}

export interface ICredentialsReceivePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialsReceive: ICredentialsReceiveAttrs
}