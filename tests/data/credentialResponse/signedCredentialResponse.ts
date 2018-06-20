export const mockPrivKey = '3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
export const privKeyDID = 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'

export const mockSignedCredResponseJson = {
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    iat: 0,
    credentialResponse: {
      suppliedCredentials: [
        {
          type: ['Credential', 'MockCredential'],
          credential: {
            '@context': ['http://schema.org/'],
            id: 'claim:id:test',
            issuer: 'did:jolo:issuer',
            claim: {
              id: 'did:jolo:subject',
              mock: 'value'
            },
            issued: '',
            type: ['Credential', 'MockCredential'],
            proof: {
              created: '1970-01-01T00:00:00.000Z',
              creator: 'did:jolo:issuer/keys#1',
              nonce: '00000',
              signatureValue: 'invalidMockSignature',
              type: 'mockType'
            }
          }
        }
      ]
    }
  },
  signature: 'ocLpyzb6ACcfoqlVLZlZYCgAZaImlR-a0hBrytItYCvuUIiNINdBv3pOa6T0flYeEaytwfJLKA_m7vtxjkC62A'
}

export const signedCredRespJWT =
  'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.\
eyJpc3MiOiJkaWQ6am9sbzo4Zjk3N2U1MGI3ZTVjYmRmZWI1M2EwM2M4MTI5MTNiNzI5NzhjYTM1Yzkz\
NTcxZjg1ZTg2Mjg2MmJhYzhjZGViIiwiaWF0IjowLCJjcmVkZW50aWFsUmVzcG9uc2UiOnsic3VwcGxp\
ZWRDcmVkZW50aWFscyI6W3sidHlwZSI6WyJDcmVkZW50aWFsIiwiTW9ja0NyZWRlbnRpYWwiXSwiY3Jl\
ZGVudGlhbCI6eyJAY29udGV4dCI6WyJodHRwOi8vc2NoZW1hLm9yZy8iXSwiaWQiOiJjbGFpbTppZDp0\
ZXN0IiwiaXNzdWVyIjoiZGlkOmpvbG86aXNzdWVyIiwiY2xhaW0iOnsiaWQiOiJkaWQ6am9sbzpzdWJq\
ZWN0IiwibW9jayI6InZhbHVlIn0sImlzc3VlZCI6IiIsInR5cGUiOlsiQ3JlZGVudGlhbCIsIk1vY2tD\
cmVkZW50aWFsIl0sInByb29mIjp7ImNyZWF0ZWQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJj\
cmVhdG9yIjoiZGlkOmpvbG86aXNzdWVyL2tleXMjMSIsIm5vbmNlIjoiMDAwMDAiLCJzaWduYXR1cmVW\
YWx1ZSI6ImludmFsaWRNb2NrU2lnbmF0dXJlIiwidHlwZSI6Im1vY2tUeXBlIn19fV19fQ.ocLpyzb6A\
CcfoqlVLZlZYCgAZaImlR-a0hBrytItYCvuUIiNINdBv3pOa6T0flYeEaytwfJLKA_m7vtxjkC62A'
