import { Identity } from '../identity/identity'

/** @TODO Should return Promise<JsonLdObject> once #377 is merged */
export type DidDocumentResolver<T> = (did: string) => Promise<T>
export type DidDocumentValidator<T> = (identityData: T) => Promise<boolean>
export type IdentityAssembler<T> = (data: T) => Identity

export type ValidatingIdentityResolverBuilder = <T>(
  resolver: DidDocumentResolver<T>,
) => (
  validator: DidDocumentValidator<T>,
) => (assembler: IdentityAssembler<T>) => ValidatingIdentityResolver

/**
 * A function composing the resolver, validator, and assembler.
 * @TODO Document
 */

export type ValidatingIdentityResolver = (did: string) => Promise<Identity>

export interface ResolutionMap {
  [method: string]: ValidatingIdentityResolver
}
