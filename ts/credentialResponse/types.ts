import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

export interface ICredentialResponseAttrs {
  iss: string
  suppliedCredentials: ISuppliedCredentialsAttrs[]
}

export interface ISuppliedCredentialsAttrs {
  type: string[]
  credential: ISignedCredentialAttrs
}
