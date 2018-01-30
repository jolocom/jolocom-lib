export default {
  testUserPublicKey: '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442',
  testUserDID:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b',
  expectedDdoJson: {
    '@context': 'https://w3id.org/did/v1',
    id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b',
    authenticationCredential:{
      id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b#keys/generic/1',
      'type':['CryptographicKey','EcDsaSAKey'],
      owner:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b',
      curve:'secp256k1',
      publicKeyBase64:'04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442'
    },
      created:'2018-01-24T15:42:15.882Z'
  }
}
