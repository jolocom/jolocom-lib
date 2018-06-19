export const mockPrivKey = '3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
export const privKeyDID = 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'

export const signedCredReqJson = {
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    iat: 0,
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    credentialRequest: {
      callbackURL: 'http://test.com',
      requestedCredentials: [{
        type: ['Credential', 'MockCredential'],
        constraints: {
          and: [
            { '==': [true, true] },
            { '==': [ { var: 'issuer' }, 'did:jolo:issuer' ] }
          ]
        }
      }]
    }
  },
  signature: 'rrkhCHtJ1vqQqVK_VzcVDFL1fa_YVXEKa8CRIuYcvSzSqDdcQv-lBq2wcFf--8tn0xGyB6HzfhzLNy5fwoOaeA'
}
export const signedCredReqJWT = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjAsImlzcyI6ImRpZDpqb2xvOjhmOTc3Z\
TUwYjdlNWNiZGZlYjUzYTAzYzgxMjkxM2I3Mjk3OGNhMzVjOTM1NzFmODVlODYyODYyYmFjOGNkZWIiL\
CJjcmVkZW50aWFsUmVxdWVzdCI6eyJyZXF1ZXN0ZWRDcmVkZW50aWFscyI6W3sidHlwZSI6WyJDcmVkZ\
W50aWFsIiwiTW9ja0NyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOnsiYW5kIjpbeyI9PSI6W3RydWUsd\
HJ1ZV19LHsiPT0iOlt7InZhciI6Imlzc3VlciJ9LCJkaWQ6am9sbzppc3N1ZXIiXX1dfX1dLCJjYWxsY\
mFja1VSTCI6Imh0dHA6Ly90ZXN0LmNvbSJ9fQ.rrkhCHtJ1vqQqVK_VzcVDFL1fa_YVXEKa8CRIuYcvS\
zSqDdcQv-lBq2wcFf--8tn0xGyB6HzfhzLNy5fwoOaeA'
