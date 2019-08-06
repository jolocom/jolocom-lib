import { ICredentialAttrs, IClaimSection } from '../credential/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { BaseMetadata } from 'cred-types-jolocom-core'
import {SignedJsonLdObject} from '../../validation/jsonLdValidator'

export interface ISignedCredentialAttrs extends ICredentialAttrs, SignedJsonLdObject {
  id: string
  issuer: string
  issued: string
  expires?: string
  claim: IClaimSection
  proof: ILinkedDataSignatureAttrs
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
