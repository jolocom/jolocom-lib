import 'reflect-metadata'
import { parse } from './parse/parse'
import { registries } from './registries'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther } from './utils/helper'

export const JolocomLib = {
  parse,
  registries,
  keyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions: constraintFunctions,
    fuelKeyWithEther
  },
  KeyTypes,
}

export { claimsMetadata } from 'cred-types-jolocom-core'