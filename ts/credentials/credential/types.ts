import { ContextEntry, ClaimInterface } from 'cred-types-jolocom-core'

type ClaimType = string | number | boolean | {}
type ClaimEntry = ClaimType | ClaimInterface

export interface IClaimSection {
  id?: string
  [x: string]: ClaimEntry
}

export interface ICredentialAttrs {
  '@context': ContextEntry[]
  type: string[]
  name?: string
  claim: ClaimEntry
}
