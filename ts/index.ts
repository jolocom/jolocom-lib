import 'reflect-metadata'
import { parse } from './parse/parse'
import { registries } from './registries'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper'
import {
  validateDigestible,
  validateDigestibles,
} from './validation/validation'

export const JolocomLib = {
  parse,
  registries,
  KeyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions,
    fuelKeyWithEther,
    getIssuerPublicKey,
    validateDigestible,
    validateDigestibles,
  },
  KeyTypes,
}

export { claimsMetadata } from 'cred-types-jolocom-core'
