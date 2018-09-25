import { ContextEntry } from 'cred-types-jolocom-core'

export const defaultContext: ContextEntry[] = [
  'https://w3id.org/identity/v1',
  {
    proof: 'https://w3id.org/security#proof'
  }
]
