import { CredentialParser } from '../credentials/credential/credentialParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser';
import { JSONWebToken } from '../interactionFlows/jsonWebToken';

export const parse = {
  interactionJSONWebToken: JSONWebToken,
  credential: CredentialParser,
  signedCredential : SignedCredentialParser
}
