import { JSONWebToken } from './JSONWebToken'
import { IJSONWebTokenAttrs } from './types'

/**
 * Aggregates all {@link JSONWebToken} parsing methods
 */

export const JSONWebTokenParser = {
  fromJWT: <T>(jwt: string): JSONWebToken<T> => JSONWebToken.decode(jwt),
  fromJSON: <T>(json: IJSONWebTokenAttrs): JSONWebToken<T> => JSONWebToken.fromJSON(json),
}
