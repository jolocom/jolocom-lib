import 'reflect-metadata'
import { parse } from './parse/parse'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper'
import { validateDigestable, validateDigestables } from './utils/validation'
import { didMethods } from './didMethods'

export const JolocomLib = {
  parse,
  didMethods: didMethods,
  KeyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions,
    fuelKeyWithEther,
    getIssuerPublicKey,
    validateDigestable,
    validateDigestables,
  },
  KeyTypes,
}

export { claimsMetadata } from '@jolocom/protocol-ts'
