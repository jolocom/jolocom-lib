import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { CredentialResponse } from '../credentialResponse/credentialResponse'
import { Credential } from '../credentials/credential'

export class UnsignedCreator {
  public static createCredential = Credential.create
  public static createCredentialRequest = CredentialRequest.create
  public static createCredentialResponse = CredentialResponse.create
}
