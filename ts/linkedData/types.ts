import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { ContextEntry } from 'cred-types-jolocom-core'

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export type JsonLdContext = ContextEntry | ContextEntry[]

export interface JsonLdObject {
  '@context'?: JsonLdContext
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}

export interface SignedJsonLdObject extends JsonLdObject {
  proof: ILinkedDataSignatureAttrs
}
