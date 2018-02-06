export default {
  randomStringFromEntropy: '13912643311766764847120568039921',
  testUserPublicKey: '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442',
  testUserDID:'did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955',
  expectedDdoObject: {
    '@context': 'https://w3id.org/did/v1',
    id:'did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955',
    authenticationCredential:{
      id:'did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955#keys/generic/1',
      'type':['CryptographicKey','EcDsaSAKey'],
      owner:'did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955',
      curve:'secp256k1',
      publicKeyBase64:'04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442'
    },
      created:'2018-01-24T15:42:15.882Z'
  },
  expectedDdoJson: '{' +
    '"@context":"https://w3id.org/did/v1",' +
    '"id":"did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955",' +
    '"authenticationCredential":{' +
      '"id":"did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955#keys/generic/1",' +
      '"type":["CryptographicKey","EcDsaSAKey"],' +
      '"owner":"did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955",' +
      '"curve":"secp256k1",' +
      '"publicKeyBase64":"04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442"' +
    '},' +
      '"created":"2018-01-24T15:42:15.882Z"' +
  '}'
}
