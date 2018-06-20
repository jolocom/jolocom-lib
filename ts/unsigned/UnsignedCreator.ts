import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { CredentialResponse } from '../credentialResponse/credentialResponse'

export class UnsignedCreator {
  // public static createCredential = TODO
  public static createCredentialRequest = CredentialRequest.create
  public static createCredentialResponse = CredentialResponse.create
}
