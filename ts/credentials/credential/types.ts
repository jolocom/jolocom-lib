import { validContextEntry } from 'cred-types-jolocom-core'

type ClaimType = string | number | boolean | {}
export type ClaimEntry = ClaimType | {[key: string]: ClaimType}

export interface IClaimSection {
  id?: string
  [x: string]: ClaimEntry
}

export interface ICredentialAttrs {
  '@context': validContextEntry[]
  type: string[]
  name?: string
  claim: ClaimEntry
}
