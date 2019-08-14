import { JsonLdObject } from '../../validation/jsonLdValidator'

export type ContextTransformer = (context: JsonLdContext) => JsonLdContext
export type JsonLdContextEntry = string | JsonLdObject
export type JsonLdContext = JsonLdContextEntry | JsonLdContextEntry[]
