import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { ContextEntry } from 'cred-types-jolocom-core'

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export type JsonLdContextEntry = ContextEntry

export type JsonLdContext = JsonLdContextEntry | JsonLdContextEntry[]

export interface JsonLdObject {
  '@context'?: JsonLdContext
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}

export interface SignedJsonLdObject extends JsonLdObject {
  proof: ILinkedDataSignatureAttrs
}
