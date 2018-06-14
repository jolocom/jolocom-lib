import { CredentialRequestParser } from '../credentialRequest/credentialRequestParser'
import { CredentialResponseParser } from '../credentialResponse/credentialResponseParser'
import { CredentialParser } from '../credentials/credential/credentialParser'
import { VerifiableCredentialParser } from '../credentials/verifiableCredential/verifiableCredentialParser';

export class Parser {
  public static credentialRequest
  public static credentialResponse
  public static credential = CredentialParser
  public static signedCredentialRequest = CredentialRequestParser
  public static signedCredentialResponse = CredentialResponseParser
  public static signedCredential = VerifiableCredentialParser
}
