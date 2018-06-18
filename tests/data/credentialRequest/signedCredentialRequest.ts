export const signedCredReqJson = {
  header: { typ: 'JWT', alg:  'ES256K' },
  payload: {
    iat: 1529328409377,
    requestedCredentials: [{
      type: ['Credential', 'ProofOfEmailCredential' ],
      constraints: { and: [ { '==': [ true, true ] } ] }
    }, {
      type: ['Credential', 'ProofOfNameCredential' ],
      constraints: { and: [ { '==': [ true, true ] } ] }
    }],
    requesterIdentity: 'did:jolo:b310d293aeac8a5ca680232b96901fe85988fde2860a1a5db69b49762923cc88',
    callbackURL: 'https://demo-sso.jolocom.com/proxy/authentication/xjnhu'
  },
  signature: '3usVd3dBc8opy-pSfq07nq1RFUsf5qEi5Tw0C-9RdgF5L7UOUEQGc_AuvlB6OwtjwKrgab-Rk6YevKkIWSB2aw'
}

export const signedCredReqJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpYXQiOjE1MjkzMjg0MDkzNzcsInJlcXVlc3RlZENyZWRlbnRpYWxzIjpbeyJ0eXBlIjpbIkNyZWRlb\
nRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjp7ImFuZCI6W3siPT0iOl\
t0cnVlLHRydWVdfV19fSx7InR5cGUiOlsiQ3JlZGVudGlhbCIsIlByb29mT2ZOYW1lQ3JlZGVudGlhbCJ\
dLCJjb25zdHJhaW50cyI6eyJhbmQiOlt7Ij09IjpbdHJ1ZSx0cnVlXX1dfX1dLCJyZXF1ZXN0ZXJJZGVu\
dGl0eSI6ImRpZDpqb2xvOmIzMTBkMjkzYWVhYzhhNWNhNjgwMjMyYjk2OTAxZmU4NTk4OGZkZTI4NjBhM\
WE1ZGI2OWI0OTc2MjkyM2NjODgiLCJjYWxsYmFja1VSTCI6Imh0dHBzOi8vZGVtby1zc28uam9sb2NvbS\
5jb20vcHJveHkvYXV0aGVudGljYXRpb24veGpuaHUifQ.3usVd3dBc8opy-pSfq07nq1RFUsf5qEi5Tw0\
C-9RdgF5L7UOUEQGc_AuvlB6OwtjwKrgab-Rk6YevKkIWSB2aw'
