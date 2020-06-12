import { DIDResolver, DIDDocument } from 'did-resolver'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { IServiceEndpointSectionAttrs } from '../identity/didDocument/sections/types'

type ResolverMap = { [key: string] : DIDResolver }

//@ts-ignore getResolver does not satisfy T
// export const createResolver = <T extends IRegistry | ResolverMap> (resolverBase: T = getResolver()): Resolver => {
//   if (isLegacyIRegistry(resolverBase)) {
//     return new Resolver({
//       //@ts-ignore TODO Sort this out
//       jolo: did => resolverBase.resolve(did).then(({ didDocument }) => didDocument)
//     })
//   } else {
//     //@ts-ignore
//     return new Resolver(resolverBase)
//   }
// }
// TODO Review this better, and decide pro or contra
// const isLegacyIRegistry = (res?: any): res is IRegistry => res && 
//   !!res.resolve &&
//   !!res.commit &&
//   !!res.authenticate

// TODO Overloaded function to create a resolver, either based on an instance of the IRegistry class (old API),
// or a Resolver Registry, see https://github.com/decentralized-identity/did-resolver/blob/develop/src/resolver.ts#L84


// TODO This part can go once we adopt the DIDDocument interface in our library
export const convertDidDocToIDidDocumentAttrs = (didDocument: DIDDocument): IDidDocumentAttrs => {
  //@ts-ignore
  return didDocument
  // return {
  //   ...didDocument,
  //   authentication: didDocument.authentication.map(({type, publicKey}) => ({type, publicKey})) || [],
  //     //@ts-ignore
  //   publicKey: didDocument.publicKey.map(({type, id, publicKeyHex, creator}) => ({type, id, publicKeyHex, creator})) || [],
  //   service: didDocument.service.map<IServiceEndpointSectionAttrs>(({id, serviceEndpoint, type, description}) => ({
  //     id, 
  //     serviceEndpoint, 
  //     type, 
  //     description: description || 'hello'
  //   })) || [],
  //   created: didDocument.created || undefined,
  //   proof: {
  //     ...didDocument.proof
  //   }
  // }
}
