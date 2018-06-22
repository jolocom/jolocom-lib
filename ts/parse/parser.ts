import { CredentialResponseParser } from '../credentialResponse/credentialResponseParser'
import { CredentialParser } from '../credentials/credential/credentialParser'
import { CredentialRequestParser } from '../credentialRequest/credentialRequestParser'
import {
  SignedCredentialRequestParser
} from '../credentialRequest/signedCredentialRequest/signedCredentialRequestParser'
import {
  SignedCredentialResponseParser
} from '../credentialResponse/signedCredentialResponse/signedCredentialResponseParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser';

export class Parser {
  public static credentialRequest = CredentialRequestParser
  public static signedCredentialRequest = SignedCredentialRequestParser

  public static credentialResponse = CredentialResponseParser
  public static signedCredentialResponse = SignedCredentialResponseParser

  public static credential = CredentialParser
  public static signedCredential = SignedCredentialParser
}
