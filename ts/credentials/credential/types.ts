import { validContextEntry } from "cred-types-jolocom-core"

// TODO DEPRECATE
export interface IClaimAttrs {
  id?: string
  [x: string]: string
}

export interface ICredentialAttrs {
  '@context': validContextEntry[]
  type: string[]
  name?: string
  claim: IClaimAttrs
}