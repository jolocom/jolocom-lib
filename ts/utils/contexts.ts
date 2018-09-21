import { validContextEntry } from 'cred-types-jolocom-core'

export const defaultContext: validContextEntry[] = [
  'https://w3id.org/identity/v1',
  {
    proof: 'https://w3id.org/security#proof'
  }
]
