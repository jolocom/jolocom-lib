import { DidDocument } from './didDocument'
import { IDidDocumentAttrs } from './didDocument/types';

/* A wrapper class for performing read operations on identities
 * */

export class Identity extends DidDocument {
  private didAttr: IDidDocumentAttrs

  constructor(didAttr) {
    super()
    this.didAttr = didAttr
  }

  public publicProfile = {
    get: this.getPublicProfile
  }

  private getPublicProfile() {
    // todo
  }
}
