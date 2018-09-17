import { SignedCredential } from '../../credentials/signedCredential/signedCredential';

export interface ICredentialReceiveAttrs {
  signedCredentials: SignedCredential[]
}

export interface ICredentialReceivePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialReceive: ICredentialReceiveAttrs
}