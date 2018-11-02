import { DidDocument } from './didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityCreateArgs } from './types'

/*
 * Class representing an identity, includes a didDocument and public profile
 * in the form of a signed credential.
 */

export class Identity {
  private didDocument: DidDocument
  private publicProfileCredential?: SignedCredential

  public getDid() {
    return this.didDocument.getDid()
  }

  public getDidDocument(): DidDocument {
    return this.didDocument
  }

  public getServiceEndpointSections() {
    return this.didDocument.getServiceEndpointSections()
  }

  public getPublicKeySection() {
    return this.didDocument.getPublicKeySections()
  }

  public setDidDocument(didDocument: DidDocument) {
    this.didDocument = didDocument
  }

  /*
   * @description - Instantiates the Identity class based on a did document and public profile
   * @param didDocument - The did document associated with a did
   * @param [publicProfile] - Verifiable credential containing public claims (e.g. name, website)
   * @returns {Object} - Instance of the Identity class
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
    delete: this.deletePublicProfile.bind(this)
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
