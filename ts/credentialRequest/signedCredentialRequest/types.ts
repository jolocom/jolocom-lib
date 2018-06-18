import { ICredentialRequest } from '../types'

export interface IJWTHeader {
  alg: string
  typ: string
}

export interface ISignedCredentialRequestAttrs {
  header: IJWTHeader
  payload: {
    iat: number
    callbackURL: string
    requesterIdentity: string
    requestedCredentials: ICredentialRequest[]
  }
  signature: string
}
