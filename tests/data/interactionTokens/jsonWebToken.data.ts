import { simpleCredRequestJSON } from './credentialRequest.data'
import { mockKeyId } from '../didDocument.data'
import { credentialSet } from './credentialRequest.data'

/* Credential request wrapped in signed JWT*/

export const validSignedCredReqJWT = {
  header: { typ: 'JWT', alg: 'ES256K' },
  payload: {
    interactionToken: simpleCredRequestJSON,
    iat: 0,
    exp: 3600000,
    iss: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
    typ: 'credentialRequest',
    jti: '2a97b35fe74b5'
  },
  signature: 'd904b6ca775f555121012ed7ec55be5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28623'
}

export const validSignature = 'd904b6ca775f555121012ed7ec55be5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28623'
export const invalidSignature = 'd904b6ca775f555121012ed7ec55be5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28613'

export const validSignedCredResJWT = {
  payload: {
    interactionToken: {
      suppliedCredentials: credentialSet,
      callbackURL: 'https://test.io/auth/abc'
    },
    typ: 'credentialResponse',
    iat: 0,
    exp: 3600000,
    iss: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
    aud: 'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
    jti: '2a97b35fe74b5'
  },
  signature: '8342b50f982c510a16c82cba595a0c69747a9f3c4830c89ce48051f9e64ff5264e17ecc5e8e7eee3a72ac36d25602f473295d7ddec568108a4d0b840461fadc0',
  header: { typ: 'JWT', alg: 'ES256K' }
}

export const validNonce = '2a97b35fe74b5'
export const invalidNonce = 'hhhhhhhhhhhhh'

/* Same credential request in base64 encoded form */

export const encodedValidCredReqJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpbnRlcmFjdGlvblRva2VuIjp7ImNyZWRlbnRpYWxSZXF1aXJlbWVudHMiOlt7InR5cGUiOlsiQ3Jl\
ZGVudGlhbCIsIlByb29mT2ZFbWFpbENyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOlt7Ij09IjpbeyJ2Y\
XIiOiJpc3N1ZXIifSwiZGlkOmpvbG86YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF\
hYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSJdfV19XSwiY2FsbGJhY2tVUkwiOiJodHRwOi8vdGVzdC5jb\
20ifSwiaWF0IjowLCJleHAiOjM2MDAwMDAsImlzcyI6ImRpZDpqb2xvOmIyZDVkOGQ2Y2MxNDAwMzM0MTl\
iNTRhMjM3YTVkYjUxNzEwNDM5ZjlmNDYyZDFmYzk4ZjY5OGVjYTdjZTk3Nzcja2V5cy0xIiwidHlwIjoiY3\
JlZGVudGlhbFJlcXVlc3QiLCJqdGkiOiIyYTk3YjM1ZmU3NGI1In0.d904b6ca775f555121012ed7ec55b\
e5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28623'

export const expiredEncodedSimpleCredReqJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpYXQiOjAsImV4cCI6MCwiaW50ZXJhY3Rpb25Ub2tlbiI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRz\
IjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFp\
bnRzIjpbeyI9PSI6W3sidmFyIjoiaXNzdWVyIn0sImRpZDpqb2xvOmFhYWFhYWFhYWFhYWFhYWFhYWFh\
YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiXX1dfV0sImNhbGxiYWNr\
VVJMIjoiaHR0cDovL3Rlc3QuY29tIn0sImlzcyI6ImRpZDpqb2xvOmIyZDVkOGQ2Y2MxNDAwMzM0MTli\
NTRhMjM3YTVkYjUxNzEwNDM5ZjlmNDYyZDFmYzk4ZjY5OGVjYTdjZTk3Nzcja2V5cy0xIiwidHlwIjoi\
Y3JlZGVudGlhbFJlcXVlc3QifQ.4fe903a33015a63a6d6e8a1054584e54b9f6e7ffea5ab196f940c\
29b7ffa14ef18a19af87c4d848db5dfa6d70e3a4d9b194da83e7eeaa3db0602e9d2d65c53d6'

export const hashedValidCredReqJWT = '96f55602967b22a28c6bc5a85dbba80aea67248623a9b8df8c118b6df84679da'
