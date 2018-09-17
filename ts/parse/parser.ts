import { CredentialParser } from '../credentials/credential/credentialParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser'
import { JSONWebToken } from '../interactionFlows/jsonWebToken'
import { CredentialRequestParser } from '../interactionFlows/credentialRequest/credentialRequestParser'

export const parse = {
  interactionJSONWebToken: JSONWebToken,
  credential: CredentialParser,
  credentialRequest : CredentialRequestParser,
  signedCredential : SignedCredentialParser
}
