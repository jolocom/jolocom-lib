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
  tokenWrong: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJrZmpucmVqIiwiaWF0IjoiMjAxOC0wMi0wNVQxNDozNTo1MC44MzFaIiwiZXhwIjoiMjAxOC0wMi0wNVQxNToyNTo1MC44MzFaIiwianRpIjoiMC5lNGtodmNwZGNoZyIsInJlcUNsYWltcyI6WyJuYW1lIl0sIklQRlNyb29tIjoia2Zlcm5ud3JrbGdtbGVtZ2ttIiwicHViS2V5SXNzIjoiMDIzZTFjNGJkYTM4YmJhNGIzMmZkOTg2YjY5NjAyNmQ1NDUzMGQ4YjJiNjNhNmIzYzdjZDhjMzI0ZWQ3ZDhkMWUyIiwiZW5jcnlwdFByaW1lIjoiIiwiZW5jcnlwdFB1YktleUlzcyI6IiJ9.jLRm7EhtNqy2ttGdroa9zT4o4FS2bIGMdWpUOg3W7mrJ38KKFAAloCIPou2TaMhOJl6zCijmuI_pT9ureOXplg'
}
