import { Resolver } from "../types";
import { getResolver, getPublicProfile } from 'jolo-did-resolver'
import { ErrorCodes } from "../../errors";
import { DIDDocument } from "did-resolver";
import { DidDocument } from "../../identity/didDocument/didDocument";
import { SoftwareKeyProvider } from "../../vaultedKeyProvider/softwareProvider";
import { getIssuerPublicKey } from "../../utils/helper";
import { Identity } from "../../identity/identity";
import { SignedCredential } from "../../credentials/signedCredential/signedCredential";
import { digestJsonLd } from "../../linkedData";
import { IPFS_ENDPOINT, PROVIDER_URL, CONTRACT_ADDRESS } from "./constants";

export class JolocomResolver implements Resolver {
  prefix: 'jolo'
  private resolutionFunctions = {
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
    this.resolutionFunctions.resolve = getResolver(
      providerUrl,
      contractAddress,
      ipfsHost,
    ).jolo
  }

  async resolve(did: string) {
    // TODO Catch or let through?
    const jsonDidDoc = await this.resolutionFunctions.resolve(did)

    if (jsonDidDoc === null) {
      throw new Error(ErrorCodes.RegistryDIDNotAnchored)
    }

    const publicProfileJson = await this.resolutionFunctions.getPublicProfile(
      jsonDidDoc,
    )

    const didDocument = DidDocument.fromJSON(jsonDidDoc)

    const signatureValid = SoftwareKeyProvider.verify(
      await digestJsonLd(jsonDidDoc, jsonDidDoc['@context']),
      getIssuerPublicKey(didDocument.signer.keyId, didDocument),
      Buffer.from(didDocument.proof.signature, 'hex'),
    )

    if (!signatureValid) {
      throw new Error(ErrorCodes.InvalidSignature)
    }

    let publicProfile: undefined | SignedCredential

    if (publicProfileJson) {
      const publicProfileCred = SignedCredential.fromJSON(
        publicProfileJson,
      )

      const isValid = await SoftwareKeyProvider.verifyDigestable(
        getIssuerPublicKey(didDocument.signer.keyId, didDocument),
        publicProfileCred,
      )

      if (isValid) {
        publicProfile = publicProfileCred
      }
    }

    return Identity.fromDidDocument({
      didDocument,
      publicProfile: publicProfile,
    })
  }
}
