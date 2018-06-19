import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

// TODO needed? Given it proxies
export interface ICredentialResponseAttrs {
  suppliedCredentials: ISuppliedCredentialsAttrs[]
}

export interface ISuppliedCredentialsAttrs {
  type: string[]
  credential: ISignedCredentialAttrs
}
