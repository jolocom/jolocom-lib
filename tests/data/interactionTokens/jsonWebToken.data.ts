import { simpleCredRequestJSON } from './credentialRequest.data'
import { mockKeyId } from '../didDocument.data'

/* Credential request wrapped in signed JWT*/

export const signedSimpleCredReqJWT = {
  header: { typ: 'JWT', alg: 'ES256K' },
  payload: {
    iat: 0,
    interactionToken: simpleCredRequestJSON,
    iss: mockKeyId,
    typ: 'credentialRequest'
  },
  signature:
    '4fe903a33015a63a6d6e8a1054584e54b9f6e7ffea5ab196f940c29b7ffa14ef18a19af87c4d848db5dfa6d70e3a4d9b194da83e7eeaa3db0602e9d2d65c53d6'
}

/* Same credential request in base64 encoded form */

export const encodedSimpleCredReqJWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpYXQiOjAsImludGVyYWN0aW9uVG9rZW4iOnsiY3JlZGVudGlhbFJlcXVpcmVtZW50cyI6W3sidHlw\
ZSI6WyJDcmVkZW50aWFsIiwiUHJvb2ZPZkVtYWlsQ3JlZGVudGlhbCJdLCJjb25zdHJhaW50cyI6W3si\
PT0iOlt7InZhciI6Imlzc3VlciJ9LCJkaWQ6am9sbzphYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh\
YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhIl19XX1dLCJjYWxsYmFja1VSTCI6Imh0\
dHA6Ly90ZXN0LmNvbSJ9LCJpc3MiOiJkaWQ6am9sbzpiMmQ1ZDhkNmNjMTQwMDMzNDE5YjU0YTIzN2E1\
ZGI1MTcxMDQzOWY5ZjQ2MmQxZmM5OGY2OThlY2E3Y2U5Nzc3I2tleXMtMSIsInR5cCI6ImNyZWRlbnRp\
YWxSZXF1ZXN0In0.4fe903a33015a63a6d6e8a1054584e54b9f6e7ffea5ab196f940c29b7ffa14ef\
18a19af87c4d848db5dfa6d70e3a4d9b194da83e7eeaa3db0602e9d2d65c53d6'

export const hashedSimpleCredReqJWT = 'e1d101408223fa76fa2cb3d51e06c0192116e031e4fefb098251e1891085ef9f'