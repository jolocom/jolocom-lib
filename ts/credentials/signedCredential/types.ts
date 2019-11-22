import { ICredentialAttrs, IClaimSection } from '../credential/types'
import { BaseMetadata } from 'cred-types-jolocom-core'
import { SignedJsonLdObject } from '../../linkedData/types'

export interface ISignedCredentialAttrs extends Omit<ICredentialAttrs, '@context'>, SignedJsonLdObject {
  id: string
  issuer: string
  issued: string
  expires?: string
  claim: IClaimSection
}

/* Allows for neat claim autocompletion based on metadata type */
export interface ISignedCredCreationArgs<T extends BaseMetadata> {
  metadata: T
  claim: T['claimInterface']
  subject: string
}

export interface IKeyMetadata {
  derivationPath: string
  keyId: string
}
