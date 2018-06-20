export const mockPrivKey = '3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
export const privKeyDID = 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'

export const signedCredReqJson = {
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    iat: 0,
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    credentialRequest: {
      requestedCredentials: [
        {
          type: ['Credential', 'MockCredential'],
          constraints: {
            and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
          }
        }
      ],
      callbackURL: 'http://test.com'
    }
  },
  signature: 'OqOTe76beHWwAchs7BAAVApdz54NK1u6uxig0Gsih9ucsLgYKlq5lK6tpKhzj3P6c3E1Kuaqe7Ok-FM8TtO3-A'
}

export const signedCredReqJWT = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.\
eyJpYXQiOjAsImlzcyI6ImRpZDpqb2xvOjhmOTc3ZTUwYjdlNWNiZGZlYjUzYTAzYzgxMjkxM2I3Mjk3\
OGNhMzVjOTM1NzFmODVlODYyODYyYmFjOGNkZWIiLCJjcmVkZW50aWFsUmVxdWVzdCI6eyJyZXF1ZXN0\
ZWRDcmVkZW50aWFscyI6W3sidHlwZSI6WyJDcmVkZW50aWFsIiwiTW9ja0NyZWRlbnRpYWwiXSwiY29u\
c3RyYWludHMiOnsiYW5kIjpbeyI9PSI6W3RydWUsdHJ1ZV19LHsiPT0iOlt7InZhciI6Imlzc3VlciJ9\
LCJkaWQ6am9sbzppc3N1ZXIiXX1dfX1dLCJjYWxsYmFja1VSTCI6Imh0dHA6Ly90ZXN0LmNvbSJ9fQ.O\
qOTe76beHWwAchs7BAAVApdz54NK1u6uxig0Gsih9ucsLgYKlq5lK6tpKhzj3P6c3E1Kuaqe7Ok-FM8T\
tO3-A'
