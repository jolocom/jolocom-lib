import 'reflect-metadata'
import { parse } from './parse/parse'
import { registries } from './registries'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'
import { constraintFunctions } from './interactionTokens/credentialRequest'

export const JolocomLib = {
  parse,
  registries,
  keyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions: constraintFunctions
  },
  KeyTypes,
}

export { claimsMetadata } from 'cred-types-jolocom-core'