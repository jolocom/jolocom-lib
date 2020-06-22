import 'reflect-metadata'
import { parse } from './parse/parse'
import { registries } from './registries'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper'
import { validateDigestable, validateDigestables } from './utils/validation'

export const JolocomLib = {
  parse,
  registries,
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
