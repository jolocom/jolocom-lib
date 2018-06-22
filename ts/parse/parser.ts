import { CredentialResponseParser } from '../credentialResponse/credentialResponseParser'
import { CredentialParser } from '../credentials/credential/credentialParser'
import { VerifiableCredentialParser } from '../credentials/verifiableCredential/verifiableCredentialParser'
import { CredentialRequestParser } from '../credentialRequest/credentialRequestParser'
import {
  SignedCredentialRequestParser
} from '../credentialRequest/signedCredentialRequest/signedCredentialRequestParser'
import {
  SignedCredentialResponseParser
} from '../credentialResponse/signedCredentialResponse/signedCredentialResponseParser'

export class Parser {
  public static credentialRequest = CredentialRequestParser
  public static signedCredentialRequest = SignedCredentialRequestParser

  public static credentialResponse = CredentialResponseParser
  public static signedCredentialResponse = SignedCredentialResponseParser

  public static credential = CredentialParser
  public static signedCredential = VerifiableCredentialParser
}
