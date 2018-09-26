import { CredentialParser } from '../credentials/credential/credentialParser'
import { SignedCredentialParser } from '../credentials/signedCredential/signedCredentialParser'
import { CredentialRequestParser } from '../interactionFlows/credentialRequest/credentialRequestParser'
import { CredentialResponseParser } from '../interactionFlows/credentialResponse/credentialResponseParser'
import { JSONWebTokenParser } from '../interactionFlows/JSONWebTokenParser'
import { CredentialsReceiveParser } from '../interactionFlows/credentialsReceive/credentialsReceiveParser'
import { AuthenticationResponseParser } from '../interactionFlows/authenticationResponse/authenticationResponseParser'
import { AuthenticationRequestParser } from '../interactionFlows/authenticationRequest/authenticationRequestParser'

export const parse = {
  interactionJSONWebToken: JSONWebTokenParser,
  credential: CredentialParser,
  credentialRequest : CredentialRequestParser,
  credentialResponse: CredentialResponseParser,
  credentialsReceive: CredentialsReceiveParser,
  signedCredential : SignedCredentialParser,
  authenticationResponse: AuthenticationResponseParser,
  authenticationRequest: AuthenticationRequestParser
}
