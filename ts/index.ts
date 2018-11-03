import 'reflect-metadata'
import { parse } from './parse/parser'
import { Credential } from './credentials/credential/credential'
import { registries } from './registries'
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider'
import { KeyTypes } from './vaultedKeyProvider/types'

export const JolocomLib = {
  parse,
  registry: registries,
  keyProvider: SoftwareKeyProvider,
  unsigned: {
    createCredential: Credential.create
  },
  KeyTypes
}

export { claimsMetadata } from 'cred-types-jolocom-core'
