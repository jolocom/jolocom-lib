// As resolved from IPFS, per TX - https://rinkeby.etherscan.io/tx/0x33b4e231526a8ce330ea399a05b1346ae0620a1b430035bac3334725c895be8d, hash - QmT2LCHQGdhEuRmwnscbNkgnrtNZZmU5WrzKxdQX3PH33p
export const signedJWTTestVector0 = {
  signerDidDoc: {
    specVersion: 0.13,
    '@context': [
      {
        '@version': 1.1,
        id: '@id',
        type: '@type',
        dc: 'http://purl.org/dc/terms/',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        schema: 'http://schema.org/',
        sec: 'https://w3id.org/security#',
        didv: 'https://w3id.org/did#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        specVersion: 'schema:version',
        AuthenticationSuite: 'sec:AuthenticationSuite',
        CryptographicKey: 'sec:Key',
        EquihashProof2017: 'sec:EquihashProof2017',
        GraphSignature2012: 'sec:GraphSignature2012',
        IssueCredential: 'didv:IssueCredential',
        LinkedDataSignature2015: 'sec:LinkedDataSignature2015',
        LinkedDataSignature2016: 'sec:LinkedDataSignature2016',
        RsaCryptographicKey: 'sec:RsaCryptographicKey',
        RsaSignatureAuthentication2018: 'sec:RsaSignatureAuthentication2018',
        RsaSigningKey2018: 'sec:RsaSigningKey',
        RsaSignature2015: 'sec:RsaSignature2015',
        RsaSignature2017: 'sec:RsaSignature2017',
        UpdateDidDescription: 'didv:UpdateDidDescription',
        authentication: 'sec:authenticationMethod',
        authenticationCredential: 'sec:authenticationCredential',
        authorizationCapability: 'sec:authorizationCapability',
        canonicalizationAlgorithm: 'sec:canonicalizationAlgorithm',
        capability: 'sec:capability',
        comment: 'rdfs:comment',
        controller: { '@id': 'sec:controller', '@type': '@id' },
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        description: 'schema:description',
        digestAlgorithm: 'sec:digestAlgorithm',
        digestValue: 'sec:digestValue',
        domain: 'sec:domain',
        entity: 'sec:entity',
        equihashParameterAlgorithm: 'sec:equihashParameterAlgorithm',
        equihashParameterK: {
          '@id': 'sec:equihashParameterK',
          '@type': 'xsd:integer',
        },
        equihashParameterN: {
          '@id': 'sec:equihashParameterN',
          '@type': 'xsd:integer',
        },
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        field: { '@id': 'didv:field', '@type': '@id' },
        label: 'rdfs:label',
        minimumProofsRequired: 'sec:minimumProofsRequired',
        minimumSignaturesRequired: 'sec:minimumSignaturesRequired',
        name: 'schema:name',
        nonce: 'sec:nonce',
        normalizationAlgorithm: 'sec:normalizationAlgorithm',
        owner: { '@id': 'sec:owner', '@type': '@id' },
        permission: 'sec:permission',
        permittedProofType: 'sec:permittedProofType',
        privateKey: { '@id': 'sec:privateKey', '@type': '@id' },
        privateKeyPem: 'sec:privateKeyPem',
        proof: 'sec:proof',
        proofAlgorithm: 'sec:proofAlgorithm',
        proofType: 'sec:proofType',
        proofValue: 'sec:proofValue',
        publicKey: {
          '@id': 'sec:publicKey',
          '@type': '@id',
          '@container': '@set',
        },
        publicKeyHex: 'sec:publicKeyHex',
        publicKeyPem: 'sec:publicKeyPem',
        requiredProof: 'sec:requiredProof',
        revoked: { '@id': 'sec:revoked', '@type': 'xsd:dateTime' },
        seeAlso: { '@id': 'rdfs:seeAlso', '@type': '@id' },
        service: {
          '@id': 'sec:service-endpoints',
          '@type': '@id',
          '@container': '@set',
        },
        serviceEndpoint: 'sec:dfn-service-endpoints',
        signature: 'sec:signature',
        signatureAlgorithm: 'sec:signatureAlgorithm',
        signatureValue: 'sec:signatureValue',
        updated: { '@id': 'didv:updated', '@type': 'xsd:dateTime' },
      },
    ],
    id:
      'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa',
    authentication: [
      'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa#keys-1',
    ],
    publicKey: [
      {
        controller:
          'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa',
        id:
          'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa#keys-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyHex:
          '03ba39f25f8b0447b4981f2ef9cec2db6dcc94650c193ce5666ada856b299a7f6b',
      },
      {
        controller: [
          'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa#keys-3',
        ],
        id: 'urn:uuid:d9c7ba5c-4fef-4086-8edd-131839b691d8',
        type: 'X25519KeyAgreementKey2019',
        publicKeyHex:
          '625240f12d39c95f9dfb75d08dda1fb69754ff33fce058fa10d805bb66fe6e7f',
      },
    ],
    service: [],
    created: '2020-08-29T15:12:09.215Z',
    updated: '2020-08-29T15:12:09.218Z',
    proof: {
      created: '2020-08-29T15:12:09.218Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '4b8cf50610b89739',
      signatureValue:
        '99b7d28ddf077fb065b678e03c7088b4d0bec17ce0dcfdd0c6203a784973d3a3461e44228bacadf12eed883554de3365200442182672d456bdb8739bc53fbbd4',
      creator:
        'did:jolo:fcd7a8683b2a38e2c040a9f14d58f0da92c42e2fb5936f0ba5faac81e6b66eaa#keys-1',
    },
  },
  signedJWT:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpbnRlcmFjdGlvblRva2VuIjp7ImNhbGxiYWNrVVJMIjoiaHR0cHM6Ly90ZXN0LmNvbSIsImRlc2NyaXB0aW9uIjoiSGVsbG8gd29ybGQifSwidHlwIjoiYXV0aGVudGljYXRpb24iLCJpYXQiOjE1OTg3MTM5NDg2NTcsImV4cCI6MTU5ODcxNzU0ODY1NywianRpIjoiZjJkNWIxZThlM2FhMWIwYiIsImlzcyI6ImRpZDpqb2xvOmZjZDdhODY4M2IyYTM4ZTJjMDQwYTlmMTRkNThmMGRhOTJjNDJlMmZiNTkzNmYwYmE1ZmFhYzgxZTZiNjZlYWEja2V5cy0xIn0.a6f8cf6b58ab436ffa2cf88ecaf8d103efff3b03ea571080f797780461644773521f7d166debbe3fc518a048735efe61ced3ecbb17610051b3c0ae294e4c3c47',
}

export const signedJWTTestVector1 = {
  signerDidDoc: {
    '@context': 'https://www.w3.org/ns/did/v1',
    id:
      'did:jun:FqjwQso17GpyV7hTbX6Di3K0nX5PPAQOsdAMo7jPZUafnWFZhzoN7G7ZTgvRI01hkOIeAVTm6_0miZxu0c9OfvQ',
    publicKey: [
      {
        controller:
          'did:jun:FqjwQso17GpyV7hTbX6Di3K0nX5PPAQOsdAMo7jPZUafnWFZhzoN7G7ZTgvRI01hkOIeAVTm6_0miZxu0c9OfvQ',
        id: '#DpEY6d26GO3AEEDk_QTiUdcfBe3wjjQ18zYkMEU6C_84',
        type: 'Ed25519VerificationKey2018',
        publicKeyHex:
          'a4463a776e863b700410393f41389475c7c17b7c238d0d7ccd890c114e82ffce',
      },
      {
        controller:
          'did:jun:FqjwQso17GpyV7hTbX6Di3K0nX5PPAQOsdAMo7jPZUafnWFZhzoN7G7ZTgvRI01hkOIeAVTm6_0miZxu0c9OfvQ',
        id: '#CTOBPyAgYTzkH1lSGyGMUxb0v-4hS_9Zgy04Z7qRcOyQ',
        type: 'X25519KeyAgreementKey2019',
        publicKeyHex:
          '4ce04fc808184f3907d65486c86314c5bd2ffb8852ffd660cb4e19eea45c3b24',
      },
    ],
    proof: {
      created: '2020-08-29T16:37:43.837Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '',
      signatureValue: '',
      creator: '',
    },
  },
  signedJWT:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpbnRlcmFjdGlvblRva2VuIjp7ImNhbGxiYWNrVVJMIjoiaHR0cHM6Ly90ZXN0LmNvbSIsImRlc2NyaXB0aW9uIjoiSGVsbG8gd29ybGQifSwidHlwIjoiYXV0aGVudGljYXRpb24iLCJpYXQiOjE1OTg3MTkwNjM4NTIsImV4cCI6MTU5ODcyMjY2Mzg1MiwianRpIjoiNTk4MDE0OWNjN2Y1NjQ4ZiIsImlzcyI6ImRpZDpqdW46RnFqd1FzbzE3R3B5VjdoVGJYNkRpM0swblg1UFBBUU9zZEFNbzdqUFpVYWZuV0ZaaHpvTjdHN1pUZ3ZSSTAxaGtPSWVBVlRtNl8wbWlaeHUwYzlPZnZRI0RwRVk2ZDI2R08zQUVFRGtfUVRpVWRjZkJlM3dqalExOHpZa01FVTZDXzg0In0.a209f0e238362b1031bbd368c98dcb93848d13d2087f48ab48f3593316cca747aa52d4d5d1f6b8152989412f6544e1e4b53e856914afb686aae1dcb14374830e',
}
