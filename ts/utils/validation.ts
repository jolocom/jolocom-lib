import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { IRegistry } from '../registries/types'
import { Resolver, DIDResolver } from 'did-resolver'
import { DidDocument } from '../identity/didDocument/didDocument'
import { getResolver } from 'jolo-did-resolver/js'
import { jolocomResolver } from '../registries/jolocomRegistry'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, customRegistry) // true`
 * @returns {boolean} - True if signature is valid, false otherwise
 */

export const validateDigestable = async (
  toValidate: IDigestable,
  customRegistry?: IRegistry | {[key: string] : any},
): Promise<boolean> => {
  const reg = createResolver(customRegistry)
  const issuerIdentity = await reg.resolve(toValidate.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(
      toValidate.signer.keyId,
      //@ts-ignore TODO DidDocument vs IDidDocumentAttrs
      DidDocument.fromJSON(issuerIdentity)
    )
    return SoftwareKeyProvider.verifyDigestable(issuerPublicKey, toValidate)
  } catch {
    return false
  }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, customRegistry) // [true, false...]`
 * @returns {Array<boolean>} - Where true if signature is valid, false otherwise
 */

export const validateDigestables = async (
  toValidate: IDigestable[],
  customRegistry?: IRegistry | {[key: string] : any},
): Promise<boolean[]> =>
  Promise.all(
    toValidate.map(async digestable =>
      validateDigestable(digestable, createResolver(customRegistry)),
    ),
  )

// TODO
const isLegacyIRegistry = (res?: any): res is IRegistry => res && 
  !!res.resolve &&
  !!res.commit &&
  !!res.authenticate

// TODO Overloaded function to create a resolver, either based on an instance of the IRegistry class (old API),
// or a Resolver Registry, see https://github.com/decentralized-identity/did-resolver/blob/develop/src/resolver.ts#L84

type ResolverMap = { [key: string] : DIDResolver }

//@ts-ignore getResolver does not satisfy T
export const createResolver = <T extends IRegistry | ResolverMap> (resolverBase: T = getResolver()): Resolver => {
  if (isLegacyIRegistry(resolverBase)) {
    return new Resolver({
      //@ts-ignore
      jolo: did => resolverBase.resolve(did).then(({ didDocument }) => didDocument)
    })
  } else {
    //@ts-ignore
    return new Resolver(resolverBase)
  }
}
