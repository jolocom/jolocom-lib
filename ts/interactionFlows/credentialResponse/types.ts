import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export interface ICredentialResponseAttrs {
  callbackURL: string
  suppliedCredentials: ISignedCredentialAttrs[]
}
