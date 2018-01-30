export default {
  ddo: {
    "@context": "https://w3id.org/did/v1",
    "id":"did:jolo:6xExKfgg2WRGBPLJeUhmYk",
      "authenticationCredential": {
        "id":"did:jolo:6xExKfgg2WRGBPLJeUhmYk#keys/generic/1",
        "type":["CryptographicKey","EcDsaSAKey"],
        "owner":"did:jolo:6xExKfgg2WRGBPLJeUhmYk",
        "curve":"secp256k1",
        "publicKeyBase64":"04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442"
      },
    "created":"2018-01-24T15:42:15.882Z",
    "service": {
        "openid": "https://openid.example.com/456"
    }
  },
  rawPrivateKey: '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
  rawPublicKey: '03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJkaWQiOiJkaWQ6am9sbzo2eEV4S2ZnZzJXUkdCUExKZVVobVlrIiwiY2xhaW1zIjpbIm5hbWUiLCJwcm9vZk9mQWdlIl0sIklQRlNyb29tIjoiZmVrcm5rZWdyIn0.X3wSp7B1BpgrATfX3ovtbCWGnZ3gimXwb___ZakwlyNmtZ_W3HRRGTEmA0qwLRh2KebWQYO1lmFRo1-mS2P6-Q',
  tokenData:  { header: { typ: 'JWT', alg: 'ES256K' },
  payload:
   { did: 'did:jolo:6xExKfgg2WRGBPLJeUhmYk',
     claims: [ 'name', 'proofOfAge' ],
     IPFSroom: 'fekrnkegr' },
  signature: 'X3wSp7B1BpgrATfX3ovtbCWGnZ3gimXwb___ZakwlyNmtZ_W3HRRGTEmA0qwLRh2KebWQYO1lmFRo1-mS2P6-Q' }
}
