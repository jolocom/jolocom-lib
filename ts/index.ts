import 'reflect-metadata'
import { parse } from './parse/parse'
import { parseAndValidate } from './parse/parseAndValidate'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther } from './utils/helper'
import { validateDigestable, validateDigestables } from './utils/validation'
import { didMethods } from './didMethods'
import {
  SoftwareKeyProvider,
  KeyTypes,
} from '@jolocom/vaulted-key-provider'
import { walletUtils } from '@jolocom/native-core'
import { createIdentityFromKeyProvider } from './didMethods/utils'

export const JolocomLib = {
  parse,
  parseAndValidate,
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

export {
  SoftwareKeyProvider,
  IVaultedKeyProvider,
} from '@jolocom/vaulted-key-provider'

export { claimsMetadata } from '@jolocom/protocol-ts'
