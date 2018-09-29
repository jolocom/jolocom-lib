import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export interface ICredentialResponsePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialResponse: ICredentialResponseAttrs
}

export interface ICredentialResponsePayloadCreationAttrs {
  typ: string
  credentialResponse: ICredentialResponseAttrs
}

export interface ICredentialResponseAttrs {
  suppliedCredentials: ISignedCredentialAttrs[]
}

