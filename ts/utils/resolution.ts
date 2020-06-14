import { DIDDocument } from 'did-resolver'
import { IDidDocumentAttrs } from '../identity/didDocument/types'

export const convertDidDocToIDidDocumentAttrs = (didDocument: DIDDocument): IDidDocumentAttrs => {
  //@ts-ignore
  return didDocument

  // return {
  //   ...didDocument,
  //   authentication: didDocument.authentication.map(({type, publicKey}) => ({type, publicKey})) || [],
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
