import { IVerifiableCredentialAttrs } from '../credentials/verifiableCredential/types';

export interface ICredentialResponseAttrs {
  iss: string
  suppliedCredentials: ISuppliedCredentialsAttrs[]
}

export interface ISuppliedCredentialsAttrs {
  type: string[]
  credential: IVerifiableCredentialAttrs
}
