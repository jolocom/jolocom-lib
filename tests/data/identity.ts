export default {
  randomStringFromEntropy: '13912643311766764847120568039921',
  testPublicKeyHex: '030c77073c06824b413c2e08bf5fd271cfa3fdd4632ec6e8869b53e5c79395b868',
  testUserPublicKey: '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442',
  testUserDID: 'did:jolo:0x189b1ce641c167e8219e7d2c7a7833011f82b4630cbc3e9fe68d100b88dfc5b2',
  expectedDdoObject: {
    '@context': 'https://w3id.org/did/v1',
    id:'did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f',
    authenticationCredential:{
      id:'did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f#keys/generic/1',
      'type':['CryptographicKey','EcDsaSAKey'],
      owner:'did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f',
      curve:'secp256k1',
      publicKeyBase64:'Awx3BzwGgktBPC4Iv1/Scc+j/dRjLsbohptT5ceTlbho'
    },
      created:'2018-01-24T15:42:15.882Z'
  },
  expectedDdoJson: '{' +
    '"@context":"https://w3id.org/did/v1",' +
    '"credentialsEndpoint":"",' +
    '"id":"did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f",' +
    '"authenticationCredential":{' +
      '"id":"did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f#keys/generic/1",' +
      '"type":["CryptographicKey","EcDsaSAKey"],' +
      '"owner":"did:jolo:0x28434a594dc0f9885dcbc797dc34f993f7dda463fc21d333c797dd5e75d7845f",' +
      '"curve":"secp256k1",' +
      '"publicKeyBase64":"Awx3BzwGgktBPC4Iv1/Scc+j/dRjLsbohptT5ceTlbho"' +
    '},' +
      '"created":"2018-01-24T15:42:15.882Z"' +
  '}',
  expectedVerifiedCredential: {
    '@context': "https://w3id.org/credentials/v1",
    id: '11111',
    'type': ["Credential"],
		issuer: 'did:jolo:0x0aecaae09eb4b6433a4136fbac29a5ea93dd3593dd120e16a314744d3945d119',
 		issued:'Wed Jan 24 2018 16:42:15 GMT+0100 (CET)',
    claim: {
      id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b',
      ageOver: 21
    }
  },
  expectedSignedCredential: {
    "credential": {
      "@context":"https://w3id.org/credentials/v1",
      "id":"11111",
      "type":["Credential"],
      "issuer":"did:jolo:0xf334484858571199b681f6dfdd9ecd2f01df5b38f8379b3aaa89436c61fd1955",
      "issued":"Wed Jan 24 2018 16:42:15 GMT+0100 (CET)",
      "claim":{"id":"did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b","ageOver":21}
    },
    "signature":"db5b35fd89c232674ac3bcc2036edc9721db9f142ae3985cb0cce8cd0b23647677797f01fa090967973ddd437affb6774ef792583a3687006e380ce6864651ca"
  }
}
