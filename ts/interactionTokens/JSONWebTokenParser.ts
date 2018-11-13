import { JSONWebToken } from './JSONWebToken'

/**
 * Aggregates all {@link JSONWebToken} parsing methods
 */

export const JSONWebTokenParser = {
  fromJWT: JSONWebToken.decode,
  fromJSON: JSONWebToken.fromJSON,
}
