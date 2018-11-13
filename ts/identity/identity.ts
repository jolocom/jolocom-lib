import { DidDocument } from './didDocument/didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityCreateArgs } from './types'

/**
 * @class
 * Class representing an identity
 */

export class Identity {
  private _didDocument: DidDocument
  private _publicProfileCredential?: SignedCredential

  get did() {
    return this.didDocument.did
  }

  set did(did: string) {
    this.didDocument.did = did
  }

  get didDocument(): DidDocument {
    return this._didDocument
  }

  set didDocument(didDocument: DidDocument) {
    this._didDocument = didDocument
  }

  get serviceEndpointSections() {
    return this.didDocument.service
  }

  get publicKeySection() {
    return this.didDocument.publicKey
  }

  get publicProfile() {
    return this._publicProfileCredential
  }

  set publicProfile(publicProfile: SignedCredential | undefined) {
    this._publicProfileCredential = publicProfile
  }

  /**
   * @description - Instantiates the Identity class based on a did document and public profile
   * @param didDocument - The did document associated with a did
   * @param publicProfile - Verifiable credential containing public claims (e.g. name, website)
   * @returns {Identity}
   */

  public static fromDidDocument({ didDocument, publicProfile }: IIdentityCreateArgs): Identity {
    const identity = new Identity()
    identity.didDocument = didDocument
    if (publicProfile) {
      identity.publicProfile = publicProfile
    }

    return identity
  }
}
