import { expect } from 'chai'
import { decodeToken } from 'jsontokens'
import { SignedCredentialRequest } from '../ts/credentialRequest/signedCredentialRequest/signedCredentialRequest'

// TODO different source
// tslint:disable-next-line:max-line-length
const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1MjkzMjg0MDkzNzcsInJlcXVlc3RlZENyZWRlbnRpYWxzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjp7ImFuZCI6W3siPT0iOlt0cnVlLHRydWVdfV19fSx7InR5cGUiOlsiQ3JlZGVudGlhbCIsIlByb29mT2ZOYW1lQ3JlZGVudGlhbCJdLCJjb25zdHJhaW50cyI6eyJhbmQiOlt7Ij09IjpbdHJ1ZSx0cnVlXX1dfX1dLCJyZXF1ZXN0ZXJJZGVudGl0eSI6ImRpZDpqb2xvOmIzMTBkMjkzYWVhYzhhNWNhNjgwMjMyYjk2OTAxZmU4NTk4OGZkZTI4NjBhMWE1ZGI2OWI0OTc2MjkyM2NjODgiLCJjYWxsYmFja1VSTCI6Imh0dHBzOi8vZGVtby1zc28uam9sb2NvbS5jb20vcHJveHkvYXV0aGVudGljYXRpb24veGpuaHUifQ.3usVd3dBc8opy-pSfq07nq1RFUsf5qEi5Tw0C-9RdgF5L7UOUEQGc_AuvlB6OwtjwKrgab-Rk6YevKkIWSB2aw'

const json = {
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

describe('SignedCredentialRequest', () => {
  it('Should implement static create method', () => {
    const signedCR = SignedCredentialRequest.create(json)
    expect(signedCR.toJSON()).to.deep.equal(json)
  })

  it('Should implement static fromJSON method', () => {
    const signedCR = SignedCredentialRequest.fromJSON(json)
    expect(signedCR.toJSON()).to.deep.equal(json)
  })

  it('Should implement toJSON method', () => {
    const signedCR = SignedCredentialRequest.create(json)
    expect(signedCR.toJSON()).to.deep.equal(json)
  })

  it('Should implement static fromJWT method', () => {
    const signedCR = SignedCredentialRequest.fromJWT(JWT)
    expect(signedCR.toJSON()).to.deep.equal(json)
  })

  it('Should implement toJWT method', () => {
    const signedCR = SignedCredentialRequest.fromJSON(json)
    const jwt = signedCR.toJWT()
    expect(decodeToken(jwt)).to.deep.equal(json)
  })

  it('Should implement all getter methods', () => {
    const signedCR = SignedCredentialRequest.fromJSON(json)
    expect(signedCR.getCallbackURL()).to.equal(json.payload.callbackURL)
    expect(signedCR.getRequestedCredentialTypes().length).to.equal(2)
    expect(signedCR.getRequestedCredentialTypes()).to.deep.equal([
      ['Credential', 'ProofOfEmailCredential'],
      ['Credential', 'ProofOfNameCredential']
    ])
  })

  it('Should implement a validateSignature method', () => {
    expect(false).to.equal(true)
  })

  it('Should implement an applyConstraints method', () => {
    const signedCR = SignedCredentialRequest.fromJSON(json)

    // tslint:disable-next-line:no-unused-expression
    expect(signedCR.applyConstraints).to.exist
  })
})
