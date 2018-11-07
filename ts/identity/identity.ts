import { DidDocument } from './didDocument/didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityCreateArgs } from './types'

/**
 * @class
 * Class representing an identity
 */

export class Identity {
  private didDocument: DidDocument
  private publicProfileCredential?: SignedCredential

  public getDid() {
    return this.didDocument.did
  }

  public getDidDocument(): DidDocument {
    return this.didDocument
  }

  public getServiceEndpointSections() {
    return this.didDocument.service
  }

  public getPublicKeySection() {
    return this.didDocument.publicKey
  }

  public setDidDocument(didDocument: DidDocument) {
    this.didDocument = didDocument
  }

  /**
   * @description - Instantiates the Identity class based on a did document and public profile
   * @param didDocument - The did document associated with a did
   * @param publicProfile - Verifiable credential containing public claims (e.g. name, website)
   * @returns {Identity}
  */

  public static fromDidDocument({ didDocument, publicProfile }: IIdentityCreateArgs): Identity {
    const identity = new Identity()
    identity.setDidDocument(didDocument)
    if (publicProfile) {
      identity.publicProfile.set(publicProfile)
    }

    return identity
  }

  /* Aggregates all methods modifying the public profile  */

  public publicProfile = {
    get: this.getPublicProfile.bind(this),
    set: this.setPublicProfile.bind(this),
    delete: this.deletePublicProfile.bind(this),
  }

  private getPublicProfile() {
    return this.publicProfileCredential
  }

  private setPublicProfile(publicProfile: SignedCredential) {
    this.publicProfileCredential = publicProfile
  }

  private deletePublicProfile() {
    this.publicProfileCredential = undefined
  }
}
