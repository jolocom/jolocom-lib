import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'

type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[]

export type JsonLdContextEntry = string | JsonLdObject

export type JsonLdContext = JsonLdContextEntry | JsonLdContextEntry[]

export interface JsonLdObject {
  '@context'?: JsonLdContext
  [key: string]: JsonLdPrimitive | JsonLdPrimitive[]
}

export interface SignedJsonLdObject extends JsonLdObject {
  '@context': JsonLdContext
  proof: ILinkedDataSignatureAttrs
}
