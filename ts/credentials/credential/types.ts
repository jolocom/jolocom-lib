import { validContextEntry } from 'cred-types-jolocom-core'
import { ClaimInterface } from 'cred-types-jolocom-core/types'

type ClaimType = string | number | boolean | {}
export type ClaimEntry = ClaimType | ClaimInterface

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
