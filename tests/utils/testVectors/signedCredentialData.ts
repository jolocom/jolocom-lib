// Signed credential created using jolocom-lib@5.0.2
// QmSYhjzQ3gHR1ziBe3h2Y3okXk8QZiUm5oa5YxBALBpFis, per https://rinkeby.etherscan.io/tx/0xe1b97944200b1e70ceb8f6f2ead27e138fe8957192e2f82d464f0913d7efe76d
export const signedCredTestVector0 = {
  signerDidDoc: {
    '@context': [
      {
        id: '@id',
        type: '@type',
        dc: 'http://purl.org/dc/terms/',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        schema: 'http://schema.org/',
        sec: 'https://w3id.org/security#',
        didv: 'https://w3id.org/did#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        AuthenticationSuite: 'sec:AuthenticationSuite',
        CryptographicKey: 'sec:Key',
        LinkedDataSignature2016: 'sec:LinkedDataSignature2016',
        authentication: 'sec:authenticationMethod',
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        digestAlgorithm: 'sec:digestAlgorithm',
        digestValue: 'sec:digestValue',
        domain: 'sec:domain',
        entity: 'sec:entity',
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        name: 'schema:name',
        nonce: 'sec:nonce',
        normalizationAlgorithm: 'sec:normalizationAlgorithm',
        owner: { '@id': 'sec:owner', '@type': '@id' },
        privateKey: { '@id': 'sec:privateKey', '@type': '@id' },
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
        requiredProof: 'sec:requiredProof',
        revoked: { '@id': 'sec:revoked', '@type': 'xsd:dateTime' },
        signature: 'sec:signature',
        signatureAlgorithm: 'sec:signatureAlgorithm',
        signatureValue: 'sec:signatureValue',
      },
    ],
    id:
      'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0',
    authentication: [
      {
        publicKey:
          'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0#keys-1',
        type: 'Secp256k1SignatureAuthentication2018',
      },
    ],
    publicKey: [
      {
        owner:
          'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0',
        id:
          'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0#keys-1',
        type: 'Secp256k1VerificationKey2018',
        publicKeyHex:
          '03a64e6b95baab43037a682c29ab81d157c485fdd46e281368cfeef10ab7446214',
      },
    ],
    service: [],
    created: '2020-08-29T13:36:13.471Z',
    proof: {
      created: '2020-08-29T13:36:13.475Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '6f5939e287f2f6b8',
      signatureValue:
        '1a945bb0691b6a4a3753d384cb8b8c821fdfce0b8661ea635f3694f8f032685f793f5745a6e1509590d3879ddff263dc5480bdd340062bb10b9069d3fc3e6366',
      creator:
        'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0#keys-1',
    },
  },
  signedCredential: {
    '@context': [
      {
        id: '@id',
        type: '@type',
        cred: 'https://w3id.org/credentials#',
        schema: 'http://schema.org/',
        dc: 'http://purl.org/dc/terms/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        sec: 'https://w3id.org/security#',
        Credential: 'cred:Credential',
        issuer: { '@id': 'cred:issuer', '@type': '@id' },
        issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
        claim: { '@id': 'cred:claim', '@type': '@id' },
        credential: { '@id': 'cred:credential', '@type': '@id' },
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        proof: { '@id': 'sec:proof', '@type': '@id' },
        EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        domain: 'sec:domain',
        nonce: 'sec:nonce',
        signatureValue: 'sec:signatureValue',
      },
      {
        ProofOfEmailCredential:
          'https://identity.jolocom.com/terms/ProofOfEmailCredential',
        schema: 'http://schema.org/',
        email: 'schema:email',
      },
    ],
    id: 'claimId:52285184ed4555f9',
    issuer:
      'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0',
    issued: '2020-08-29T13:50:14.705Z',
    type: ['Credential', 'ProofOfEmailCredential'],
    expires: '2021-08-29T13:50:14.701Z',
    proof: {
      created: '2020-08-29T13:50:14.704Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '333dfe6167578694',
      signatureValue:
        '970e5d5a1f259011d282d0b462526cfe4c2251dee9e2ebe342d6f5efb395e5d542eff90afa5c4ed76d848a65509d522d5d910530e825f6fa61c45245b867bd16',
      creator:
        'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0#keys-1',
    },
    claim: {
      email: 'Eg',
      id:
        'did:jolo:90113fa0a2d8929af684432c8b7bf959543547a0de51f6ef0fee8af3f24438e0',
    },
    name: 'Email address',
  },
}

export const signedCredTestVector1 = {
  signerDidDoc: {
    '@context': 'https://www.w3.org/ns/did/v1',
    id:
      'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHcyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA',
    publicKey: [
      {
        controller:
          'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHcyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA',
        id: '#DdDNpdu4UVTBnI7j2aomgO5ogIOSi1y2NhAQK71PL3jk',
        type: 'Ed25519VerificationKey2018',
        publicKeyHex:
          '74336976ee1455306723b8f66a89a03b9a2020e4a2d72d8d84040aef53cbde39',
      },
      {
        controller:
          'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA',
        id: '#Cfui39YTBfQoxjtjtx_mQZSHUE6bxDMGmzvn5n4dJPE8',
        type: 'X25519KeyAgreementKey2019',
        publicKeyHex:
          '7ee8b7f584c17d0a318ed8edc7f9906521d413a6f10cc1a6cef9f99f87493c4f',
      },
    ],
    proof: {
      created: '2020-08-29T14:23:19.759Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '',
      signatureValue: '',
      creator: '',
    },
  },
  signedCredential: {
    '@context': [
      {
        id: '@id',
        type: '@type',
        cred: 'https://w3id.org/credentials#',
        schema: 'http://schema.org/',
        dc: 'http://purl.org/dc/terms/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        sec: 'https://w3id.org/security#',
        Credential: 'cred:Credential',
        issuer: { '@id': 'cred:issuer', '@type': '@id' },
        issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
        claim: { '@id': 'cred:claim', '@type': '@id' },
        credential: { '@id': 'cred:credential', '@type': '@id' },
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        proof: { '@id': 'sec:proof', '@type': '@id' },
        EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        domain: 'sec:domain',
        nonce: 'sec:nonce',
        signatureValue: 'sec:signatureValue',
      },
      {
        ProofOfPostalAddressCredential:
          'https://identity.jolocom.com/terms/ProofOfPostalAddressCredential',
        schema: 'http://schema.org/',
        addressLine1: 'schema:streetAddress',
        addressLine2: 'schema:streetAddress',
        postalCode: 'schema:postalCode',
        city: 'schema:addressLocality',
        country: 'schema:addressCountry',
      },
    ],
    id: 'claimId:c3f30ec0e38e37b3',
    issuer:
      'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHcyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA',
    issued: '2020-08-29T14:23:19.764Z',
    type: ['Credential', 'ProofOfPostalAddressCredential'],
    expires: '2021-08-29T14:23:19.763Z',
    proof: {
      created: '2020-08-29T14:23:19.764Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '1bb32ee5934bcf62',
      signatureValue:
        '1019bc675c9e20e6ea2c33f1371a6859bb5e73dd72bc463296886cb0aad532915c4bbc7103298ad0f3bc9a15e19edb96d281787509f00613f46e4204b40ca401',
      creator:
        'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHcyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA#DdDNpdu4UVTBnI7j2aomgO5ogIOSi1y2NhAQK71PL3jk',
    },
    claim: {
      addressLine1: 'first address line',
      addressLine2: 'second address line',
      city: 'Chisinau',
      postalCode: 53123,
      id:
        'did:jun:FhHgj-WRVqeODSIJl1a8GDV9KG9WM8HLIo6ucni6zlHcyJNhQxHW5nA6YLR4NQuOB2X1xdkYUq7VRBUBahCYmpA',
    },
    name: 'Postal Address',
  },
}

// QmQq8m7LUx3SE5MM5d8q7Q2cs7HX1effEWxYwbYYztEBM8 as per https://rinkeby.etherscan.io/tx/0xd66cdebada00aeeaf98c494f33c43bbf98ec7a4b62f0762f543dffe83d696f53
export const signedCredTestVector2 = {
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
      'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0',
    authentication: [
      'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0#keys-1',
    ],
    publicKey: [
      {
        controller:
          'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0',
        id:
          'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0#keys-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyHex:
          '03805ea8b2ed3eaae3073c267da1c76137202440bcc3bb3eb16b6e1220dfee8ec2',
      },
      {
        controller: [
          'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0#keys-3',
        ],
        id: 'urn:uuid:ea7934ce-dbe8-4baa-a607-17713c5fa1bd',
        type: 'X25519KeyAgreementKey2019',
        publicKeyHex:
          '2e7f516f8ad9154ca900a143f46c1a552be9c6127dc0766b05b8389126cc842e',
      },
    ],
    service: [],
    created: '2020-08-29T15:01:45.103Z',
    updated: '2020-08-29T15:01:45.106Z',
    proof: {
      created: '2020-08-29T15:01:45.106Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: 'd8adbc2cbf565e4b',
      signatureValue:
        'ba973244a54d26d3c685e22d28825d1ced25ba47aeae481b251d579c269884f446008a16ff2f49330d3e1384622f31b729f679550391d9659fb194ea118a5277',
      creator:
        'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0#keys-1',
    },
  },
  signedCredential: {
    '@context': [
      {
        id: '@id',
        type: '@type',
        cred: 'https://w3id.org/credentials#',
        schema: 'http://schema.org/',
        dc: 'http://purl.org/dc/terms/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        sec: 'https://w3id.org/security#',
        Credential: 'cred:Credential',
        issuer: { '@id': 'cred:issuer', '@type': '@id' },
        issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
        claim: { '@id': 'cred:claim', '@type': '@id' },
        credential: { '@id': 'cred:credential', '@type': '@id' },
        expires: { '@id': 'sec:expiration', '@type': 'xsd:dateTime' },
        proof: { '@id': 'sec:proof', '@type': '@id' },
        EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
        created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
        creator: { '@id': 'dc:creator', '@type': '@id' },
        domain: 'sec:domain',
        nonce: 'sec:nonce',
        signatureValue: 'sec:signatureValue',
      },
      {
        ProofOfPostalAddressCredential:
          'https://identity.jolocom.com/terms/ProofOfPostalAddressCredential',
        schema: 'http://schema.org/',
        addressLine1: 'schema:streetAddress',
        addressLine2: 'schema:streetAddress',
        postalCode: 'schema:postalCode',
        city: 'schema:addressLocality',
        country: 'schema:addressCountry',
      },
    ],
    id: 'claimId:7024dbc05c363ec0',
    issuer:
      'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0',
    issued: '2020-08-29T15:01:58.964Z',
    type: ['Credential', 'ProofOfPostalAddressCredential'],
    expires: '2021-08-29T15:01:58.955Z',
    proof: {
      created: '2020-08-29T15:01:58.963Z',
      type: 'EcdsaKoblitzSignature2016',
      nonce: '39f1c6167efbae6b',
      signatureValue:
        '83aa04953c53ad4ef35f9d44005bd65b80889adc22491ff193c373d9bbff0e33282c579ad5ee869e38e9eb666f860077d8208cd6e09ab67aca347dc157800490',
      creator:
        'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0#keys-1',
    },
    claim: {
      addressLine1: 'first address line',
      addressLine2: 'second address line',
      city: 'Chisinau',
      postalCode: 53123,
      id:
        'did:jolo:ba8570fa7578a97290bc8fbe4e29ce7226e03d7ec9c6df71fe5583d018d43bf0',
    },
    name: 'Postal Address',
  },
}
