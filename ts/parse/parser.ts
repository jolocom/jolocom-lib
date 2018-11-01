import { CredentialParser } from '../credentials/credential/credentialParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser'
import { JSONWebTokenParser } from '../interactionFlows/JSONWebTokenParser'
import { CredentialsReceiveParser } from '../interactionFlows/credentialsReceive/credentialsReceiveParser'

export const parse = {
  interactionJSONWebToken: JSONWebTokenParser,
  credential: CredentialParser,
  credentialsReceive: CredentialsReceiveParser,
  signedCredential : SignedCredentialParser,
}
