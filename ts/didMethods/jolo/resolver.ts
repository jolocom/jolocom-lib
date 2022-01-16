import { IResolver } from '../types'
import { getResolver, getPublicProfile } from '@jolocom/jolo-did-resolver'
import { ErrorCodes } from '../../errors'
import { DIDDocument, Resolver } from 'did-resolver'
import { Identity } from '../../identity/identity'
import { SignedCredential } from '../../credentials/outdated/signedCredential'
import { IPFS_ENDPOINT, PROVIDER_URL, CONTRACT_ADDRESS } from './constants'
import { parseAndValidate } from '../../parse/parseAndValidate'

type Resolve = (did: string) => Promise<DIDDocument>

export class JolocomResolver implements IResolver {
  prefix = 'jolo'

  private resolutionFunctions: {
    resolve: Resolve
    getPublicProfile: (didDoc: DIDDocument) => any
  } = {
    resolve: undefined,
    getPublicProfile: undefined,
  }

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT,
  ) {
    this.resolutionFunctions.getPublicProfile = (didDoc: DIDDocument) =>
      getPublicProfile(didDoc, ipfsHost)

    this.resolutionFunctions.resolve = (did: string) =>
      new Resolver(getResolver(providerUrl, contractAddress, ipfsHost)).resolve(
        did,
      )
  }

  async resolve(did: string) {
    const jsonDidDoc = await this.resolutionFunctions.resolve(did).catch(_ => {
      throw new Error(ErrorCodes.RegistryDIDNotAnchored)
    })

    const publicProfileJson = await this.resolutionFunctions.getPublicProfile(
      jsonDidDoc,
    )

    //@ts-ignore
    const didDocument = await parseAndValidate.didDocument(jsonDidDoc)

    let publicProfile: undefined | SignedCredential

    if (publicProfileJson) {
      publicProfile = await parseAndValidate.signedCredential(
        publicProfileJson,
        Identity.fromDidDocument({ didDocument }),
      )
    }

    return Identity.fromDidDocument({
      didDocument,
      publicProfile,
    })
  }
}
