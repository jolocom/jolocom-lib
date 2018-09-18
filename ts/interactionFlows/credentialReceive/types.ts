import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export interface ICredentialReceivePayloadCreationAttrs {
  typ: string
  credentialReceive: ICredentialReceiveAttrs
}

export interface ICredentialReceiveAttrs {
  signedCredentials: SignedCredential[]
}

export interface ICredentialReceivePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialReceive: ICredentialReceiveAttrs
}