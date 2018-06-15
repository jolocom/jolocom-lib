import { ICredentialAttrs } from '../../credentials/credential/types'

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface ISignedCredentialRequestAttrs {
  header: IJWTHeader
  payload: ICredentialAttrs
  signature: string
}
