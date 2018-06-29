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

export const parse = {
  credentialRequest : CredentialRequestParser,
  signedCredentialRequest : SignedCredentialRequestParser,
  credentialResponse : CredentialResponseParser,
  signedCredentialResponse : SignedCredentialResponseParser,
  credential : CredentialParser,
  signedCredential : SignedCredentialParser
}
