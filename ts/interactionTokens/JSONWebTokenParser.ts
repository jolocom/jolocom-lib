import { JSONWebToken } from './JSONWebToken'

export const JSONWebTokenParser = {
 fromJWT: JSONWebToken.decode,
 fromJSON: JSONWebToken.fromJSON
}
