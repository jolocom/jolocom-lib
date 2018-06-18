import { CredentialResponseParser } from '../credentialResponse/credentialResponseParser'
import { CredentialParser } from '../credentials/credential/credentialParser'
import { VerifiableCredentialParser } from '../credentials/verifiableCredential/verifiableCredentialParser'
import { CredentialRequestParser } from '../credentialRequest/credentialRequestParser'
import {
  SignedCredentialRequestParser
} from '../credentialRequest/signedCredentialRequest/signedCredentialRequestParser'

export class Parser {
  public static credentialRequest = CredentialRequestParser
  public static credentialResponse
  public static credential = CredentialParser
  public static signedCredentialRequest = SignedCredentialRequestParser
  public static signedCredentialResponse = CredentialResponseParser
  public static signedCredential = VerifiableCredentialParser
}
