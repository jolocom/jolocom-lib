import { ContextEntry, ClaimInterface } from 'cred-types-jolocom-core'

type ClaimType = string | number | boolean | {}
/**
 * @public
 */
export type ClaimEntry = ClaimType | ClaimInterface

/**
 * @example
 * ```
 * {
 *  id: 'did:jolo:abcdef',
 *  givenName: 'Example',
 *  familyName: 'Example'
 * }
 * ```
 *
 * @param id - The did of the credential subject
 */
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
