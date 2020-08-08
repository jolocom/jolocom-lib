import 'reflect-metadata'
import { parse } from './parse/parse'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther } from './utils/helper'
import { validateDigestable, validateDigestables } from './utils/validation'
import { didMethods } from './didMethods'
import { SoftwareKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'

export const JolocomLib = {
  parse,
  didMethods: didMethods,
  KeyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions,
    fuelKeyWithEther,
    validateDigestable,
    validateDigestables,
  },
  KeyTypes,
}

export { claimsMetadata } from '@jolocom/protocol-ts'
