import { validContextEntry } from 'cred-types-jolocom-core'

type validClaimTypes = string | number | boolean
export type validClaimEntry = validClaimTypes | {[key: string]: validClaimEntry}

export interface IClaimSection {
  id?: string
  [x: string]: validClaimEntry
}

export interface ICredentialAttrs {
  '@context': validContextEntry[]
  type: string[]
  name?: string
  claim: validClaimEntry
}
