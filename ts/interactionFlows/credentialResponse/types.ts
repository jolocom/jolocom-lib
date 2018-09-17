import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types';

export interface ICredentialResponsePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialResponse: ICredentialResponsePayloadCreationAttrs
}

export interface ICredentialResponsePayloadCreationAttrs {
  typ: string
  credentialResponse: ICredentialResponseAttrs
}

export interface ICredentialResponseAttrs {
  // TODO: rethink naming of SuppliedCredential
  suppliedCredentials: ISuppliedCredentialsAttrs[]
}

export interface ISuppliedCredentialsAttrs {
  type: string[]
  credential: ISignedCredentialAttrs
}
