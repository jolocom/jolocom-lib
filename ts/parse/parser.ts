import { CredentialParser } from '../credentials/credential/credentialParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser'
import { CredentialRequestParser } from '../interactionFlows/credentialRequest/credentialRequestParser'
import { CredentialResponseParser } from '../interactionFlows/credentialResponse/credentialResponseParser';
import { JSONWebTokenParser } from '../interactionFlows/JSONWebTokenParser';

export const parse = {
  interactionJSONWebToken: JSONWebTokenParser,
  credential: CredentialParser,
  credentialRequest : CredentialRequestParser,
  credentialResponse: CredentialResponseParser,
  signedCredential : SignedCredentialParser
}
