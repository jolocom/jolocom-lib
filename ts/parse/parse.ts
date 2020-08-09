import { JSONWebTokenParser } from '../interactionTokens/JSONWebTokenParser'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ICredentialAttrs } from '../credentials/credential/types'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { JSONWebToken } from '../interactionTokens/JSONWebToken'
import { IJSONWebTokenAttrs } from '../interactionTokens/types'

/**
 * Aggregates parsing methods for easier access
 * The types are declared explicitly to ensure the d.ts file is
 * generated correctly.
 */

export interface ParseMethods {
  interactionToken: {
    fromJWT: <T>(jwt: string) => JSONWebToken<T>
    fromJSON: <T>(json: IJSONWebTokenAttrs) => JSONWebToken<T>
  }
  credential: (json: ICredentialAttrs) => Credential
  signedCredential: (json: ISignedCredentialAttrs) => SignedCredential
}

export const parse: ParseMethods = {
  interactionToken: JSONWebTokenParser,
  credential: Credential.fromJSON,
  //@dev This function is defined this way to avoid the issue -- when this file first evaluates, SignedCredential is undefined,
  //and trying to reference the static .fromJSON method throws.
  signedCredential: (json: ISignedCredentialAttrs) => SignedCredential.fromJSON(json),
}

