import { IDidDocumentAttrs } from '../identity/didDocument/types'

/** @TODO Should return Promise<JsonLdObject> once #377 is merged */
export type DidDocumentResolver = (did: string) => Promise<IDidDocumentAttrs>

export type DidDocumentValidator = (
  didDocument: IDidDocumentAttrs,
) => Promise<boolean>

/** A function composing the resolver and validator. */
export type ValidatingDidResolver = (
  resolver: DidDocumentResolver,
  validator: DidDocumentValidator,
) => DidDocumentResolver

export interface ResolutionMap {
  [method: string]: DidDocumentResolver
}
