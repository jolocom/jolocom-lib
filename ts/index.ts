import 'reflect-metadata'
import { parse } from './parse/parser'
import { Credential } from './credentials/credential/credential'
import { registries } from './registries'
import { IdentityManager, keyTypes } from './identityManager/identityManager'

export const JolocomLib = {
  parse,
  registry : registries,
  identityManager : {
    create: IdentityManager.create
  },
  unsigned : {
    createCredential: Credential.create,
  },
  keyTypes
}

export { claimsMetadata } from 'cred-types-jolocom-core'
