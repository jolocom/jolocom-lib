export default {
  ddo: {
    "@context": "https://w3id.org/did/v1",
    "id":"did:jolo:6xExKfgg2WRGBPLJeUhmYk",
      "authenticationCredential": {
        "id":"did:jolo:6xExKfgg2WRGBPLJeUhmYk#keys/generic/1",
        "type":["CryptographicKey","EcDsaSAKey"],
        "owner":"did:jolo:6xExKfgg2WRGBPLJeUhmYk",
        "curve":"secp256k1",
        "publicKeyBase64":"03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479"
      },
    "created":"2018-01-24T15:42:15.882Z",
    "service": {
        "openid": "https://openid.example.com/456"
    }
  },
  WIF: 'L1Xs8xNygctCDgry2UsYCPywgC1WUckEePZ9NGdZswTzhjoAooNu',
  rawPrivateKey: '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
  rawPublicKey: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJkaWQiOiJkaWQ6am9sbzo2eEV4S2ZnZzJXUkdCUExKZVVobVlrIiwiY2xhaW1zIjpbIm5hbWUiLCJwcm9vZk9mQWdlIl0sIklQRlNyb29tIjoiZmVrcm5rZWdyIn0.X3wSp7B1BpgrATfX3ovtbCWGnZ3gimXwb___ZakwlyNmtZ_W3HRRGTEmA0qwLRh2KebWQYO1lmFRo1-mS2P6-Q',
  tokenData:  { header: { typ: 'JWT', alg: 'ES256K' },
  payload:
   { did: 'did:jolo:6xExKfgg2WRGBPLJeUhmYk',
     claims: [ 'name', 'proofOfAge' ],
     IPFSroom: 'fekrnkegr' },
  signature: 'X3wSp7B1BpgrATfX3ovtbCWGnZ3gimXwb___ZakwlyNmtZ_W3HRRGTEmA0qwLRh2KebWQYO1lmFRo1-mS2P6-Q' },
  mockDIDSUB: 'did:jolo:6MEEEfgg2WRGBPLJeUhmYk',
  mockDIDISS: 'did:jolo:6MYOUfgg2WRGBPLJeUhmYk',
  mockTokenReq: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6am9sbzo2TVlPVWZnZzJXUkdCUExKZVVobVlrIiwic3ViIjoiIiwiZXhwIjoiIiwianRpIjoiMC52bmhzcTFjMHNpZyIsInJlcUNsYWltcyI6WyJuYW1lIiwicHJvb2ZPZkFnZSJdLCJJUEZTcm9vbSI6Imtlcm5qcmVuZyIsInB1YktleUlzcyI6IjAyM2UxYzRiZGEzOGJiYTRiMzJmZDk4NmI2OTYwMjZkNTQ1MzBkOGIyYjYzYTZiM2M3Y2Q4YzMyNGVkN2Q4ZDFlMiIsInB1YktleVN1YiI6IiIsImNsYWltcyI6IiJ9._MdVSOZh8iCG4u724lCsihrNfEKpil2gtFAzxTYp4Sd9SZ3oUNJlizFI13GXkjhOvGS9FPNbuKeqYr1RrHRAvw',
  mockTokenRes: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6am9sbzo2TVlPVWZnZzJXUkdCUExKZVVobVlrIiwic3ViIjoiZGlkOmpvbG86Nk1FRUVmZ2cyV1JHQlBMSmVVaG1ZayIsImV4cCI6IiIsImp0aSI6IjAudm5oc3ExYzBzaWciLCJyZXFDbGFpbXMiOlsibmFtZSIsInByb29mT2ZBZ2UiXSwiSVBGU3Jvb20iOiJrZXJuanJlbmciLCJwdWJLZXlJc3MiOiIwMjNlMWM0YmRhMzhiYmE0YjMyZmQ5ODZiNjk2MDI2ZDU0NTMwZDhiMmI2M2E2YjNjN2NkOGMzMjRlZDdkOGQxZTIiLCJwdWJLZXlTdWIiOiIwM2ZkZDU3YWRlYzNkNDM4ZWEyMzdmZTQ2YjMzZWUxZTAxNmVkYTZiNTg1YzNlMjdlYTY2Njg2YzJlYTUzNTg0NzkiLCJjbGFpbXMiOiIifQ.RCh05xCep8ok8U9PngeG-Eq98f3cJh48KHPGnAFAaSFEFMVflGzanrzYqBN3D__Zg41z7FxD-ZJdBEdWT-Xl3A'
}
