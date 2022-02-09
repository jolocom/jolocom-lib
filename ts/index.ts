import 'reflect-metadata'
import { parse } from './parse/parse'
import { parseAndValidate } from './parse/parseAndValidate'
import { constraintFunctions } from './interactionTokens/credentialRequest'
import { fuelKeyWithEther } from './utils/helper'
import { validateDigestable, validateDigestables } from './utils/validation'
import { didMethods } from './didMethods'
import { SoftwareKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'
import { CredentialVerifier } from './credentials/v1.1/credentialVerifier'
import { CredentialSigner } from './credentials/v1.1/credentialSigner'
import { Credential } from './credentials/v1.1/credential'
import { SignedCredential } from './credentials/v1.1/signedCredential'
import { SupportedSuites } from './linkedDataSignature'
import { IdentityWallet } from './identityWallet/identityWallet'

export const JolocomLib = {
  credentials: {
    Credential: Credential,
    SignedCredential: SignedCredential,
  },
  parse,
  parseAndValidate,
  didMethods,
  KeyProvider: SoftwareKeyProvider,
  util: {
    constraintFunctions,
    fuelKeyWithEther,
    validateDigestable,
    validateDigestables,
  },
  KeyTypes,
  LinkedDataProofTypes: SupportedSuites,
}

export { CredentialSigner, CredentialVerifier, IdentityWallet }

export {
  SoftwareKeyProvider,
  IVaultedKeyProvider,
} from '@jolocom/vaulted-key-provider'

export { claimsMetadata } from '@jolocom/protocol-ts'
