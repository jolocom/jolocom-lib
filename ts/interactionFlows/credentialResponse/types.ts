import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types';

export interface ICredentialResponsePayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialResponse: ICredentialResponseCreationAttrs
}

export interface ICredentialResponsePayloadCreationAttrs {
  typ: string
  credentialResponse: ICredentialResponseCreationAttrs
}

export interface ICredentialResponseCreationAttrs {
  // TODO: rethink naming of SuppliedCredential
  suppliedCredentials: ISuppliedCredentialsAttrs[]
}

export interface ISuppliedCredentialsAttrs {
  type: string[]
  credential: ISignedCredentialAttrs
}
