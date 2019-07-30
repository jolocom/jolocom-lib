import {IDidDocumentAttrs} from '../identity/didDocument/types'

/**
 * @TODO Should these use JSON or DidDocument json attributes?
 */
export type DidDocumentResolver = (did:string) => Promise<IDidDocumentAttrs>
export type DidDocumentValidator = (didDocument: IDidDocumentAttrs) => Promise<boolean>

export type ResolutionMap = {
  [method: string]: DidDocumentResolver
}

