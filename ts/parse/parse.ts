import { JSONWebTokenParser } from '../interactionTokens/JSONWebTokenParser'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'

/** Aggregates parsing methods for easier access */

export const parse = {
  interactionToken: JSONWebTokenParser,
  credential: Credential.fromJSON,
  signedCredential: SignedCredential.fromJSON,
}
