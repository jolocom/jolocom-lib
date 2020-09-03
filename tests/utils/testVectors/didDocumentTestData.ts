export const defaultTestDidDoc = {
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
    'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
  authentication: [
    'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
  ],
  publicKey: [
    {
      controller:
        'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777',
      id:
        'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex:
        '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
    },
  ],
  service: [],
  created: '2020-06-09T18:55:12.856Z',
  updated: '2020-09-03T14:48:02.437Z',
  proof: {
    created: '2020-06-09T18:55:12.856Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: '74945e75569f19ea',
    signatureValue:
      '4454838502a1cfea47d945dd8aa78fc6a8d66e808d38923300a67f78c6c5863f7aaaff2e622e1c750e5778fffe7d02d041f294761edf80a1cf9297a83146e84e',
    creator:
      'did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777#keys-1',
  },
}

// DID Document created with Jolocom-Lib@4.0.2
export const testDidDoc0 = {
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
}

// Random DID Document off IPFS.
export const testDidDoc1 = {
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
      created: {
        '@id': 'dc:created',
        '@type': 'xsd:dateTime',
      },
      creator: {
        '@id': 'dc:creator',
        '@type': '@id',
      },
      digestAlgorithm: 'sec:digestAlgorithm',
      digestValue: 'sec:digestValue',
      domain: 'sec:domain',
      entity: 'sec:entity',
      expires: {
        '@id': 'sec:expiration',
        '@type': 'xsd:dateTime',
      },
      name: 'schema:name',
      nonce: 'sec:nonce',
      normalizationAlgorithm: 'sec:normalizationAlgorithm',
      owner: {
        '@id': 'sec:owner',
        '@type': '@id',
      },
      privateKey: {
        '@id': 'sec:privateKey',
        '@type': '@id',
      },
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
      revoked: {
        '@id': 'sec:revoked',
        '@type': 'xsd:dateTime',
      },
      signature: 'sec:signature',
      signatureAlgorithm: 'sec:signatureAlgorithm',
      signatureValue: 'sec:signatureValue',
    },
  ],
  id:
    'did:jolo:7d8c0e4607a32c0c53367f50a9fb75260e832a517dedd49c1cf9d202b5f3e461',
  authentication: [
    {
      publicKey:
        'did:jolo:7d8c0e4607a32c0c53367f50a9fb75260e832a517dedd49c1cf9d202b5f3e461#keys-1',
      type: 'Secp256k1SignatureAuthentication2018',
    },
  ],
  publicKey: [
    {
      owner:
        'did:jolo:7d8c0e4607a32c0c53367f50a9fb75260e832a517dedd49c1cf9d202b5f3e461',
      id:
        'did:jolo:7d8c0e4607a32c0c53367f50a9fb75260e832a517dedd49c1cf9d202b5f3e461#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex:
        '03c7afcce9a6cebaf11cb5731d638f13f10de40ab18d4f04f1363297017e1c6469',
    },
  ],
  service: [],
  created: '2020-05-08T07:18:52.458Z',
  proof: {
    created: '2020-05-08T07:18:52.458Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: '9c74bf06c57fbf47',
    signatureValue:
      'b5183e93332c3a22ca52bf10ee09e9f59dac5fb8f050cfc7dcf518eac07ac33573c76119b6b3f56362d8c15e57d1cf2c7f1e50b319a773c9fd31a8de518ab9f7',
    creator:
      'did:jolo:7d8c0e4607a32c0c53367f50a9fb75260e832a517dedd49c1cf9d202b5f3e461#keys-1',
  },
}

export const testDidDoc2 = {
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
      created: {
        '@id': 'dc:created',
        '@type': 'xsd:dateTime',
      },
      creator: {
        '@id': 'dc:creator',
        '@type': '@id',
      },
      digestAlgorithm: 'sec:digestAlgorithm',
      digestValue: 'sec:digestValue',
      domain: 'sec:domain',
      entity: 'sec:entity',
      expires: {
        '@id': 'sec:expiration',
        '@type': 'xsd:dateTime',
      },
      name: 'schema:name',
      nonce: 'sec:nonce',
      normalizationAlgorithm: 'sec:normalizationAlgorithm',
      owner: {
        '@id': 'sec:owner',
        '@type': '@id',
      },
      privateKey: {
        '@id': 'sec:privateKey',
        '@type': '@id',
      },
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
      revoked: {
        '@id': 'sec:revoked',
        '@type': 'xsd:dateTime',
      },
      signature: 'sec:signature',
      signatureAlgorithm: 'sec:signatureAlgorithm',
      signatureValue: 'sec:signatureValue',
    },
  ],
  id:
    'did:jolo:056e162455fd6d11f2008989e435755aebb29a509e695a99f782cc3b8da20f80',
  authentication: [
    {
      publicKey:
        'did:jolo:056e162455fd6d11f2008989e435755aebb29a509e695a99f782cc3b8da20f80#keys-1',
      type: 'Secp256k1SignatureAuthentication2018',
    },
  ],
  publicKey: [
    {
      owner:
        'did:jolo:056e162455fd6d11f2008989e435755aebb29a509e695a99f782cc3b8da20f80',
      id:
        'did:jolo:056e162455fd6d11f2008989e435755aebb29a509e695a99f782cc3b8da20f80#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex:
        '03238c83308aed266752cf563a0e5986a82fdc0c651db1b05e8d822aee09586d95',
    },
  ],
  service: [],
  created: '2019-05-08T11:50:54.779Z',
  proof: {
    created: '2019-05-08T11:50:54.780Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: 'c20e138ca7210dcc',
    signatureValue:
      '54e1f072d1bad8b40d2fadd9ae29102e5387929c6e5e85a679718ac9e4b12f5969e172a6539dd649879ba05544264152dc5b9568e35e52452a132e77a4fe8f6a',
    creator:
      'did:jolo:056e162455fd6d11f2008989e435755aebb29a509e695a99f782cc3b8da20f80#keys-1',
  },
}

export const testDidDoc3 = {
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
      controller: {
        '@id': 'sec:controller',
        '@type': '@id',
      },
      created: {
        '@id': 'dc:created',
        '@type': 'xsd:dateTime',
      },
      creator: {
        '@id': 'dc:creator',
        '@type': '@id',
      },
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
      expires: {
        '@id': 'sec:expiration',
        '@type': 'xsd:dateTime',
      },
      field: {
        '@id': 'didv:field',
        '@type': '@id',
      },
      label: 'rdfs:label',
      minimumProofsRequired: 'sec:minimumProofsRequired',
      minimumSignaturesRequired: 'sec:minimumSignaturesRequired',
      name: 'schema:name',
      nonce: 'sec:nonce',
      normalizationAlgorithm: 'sec:normalizationAlgorithm',
      owner: {
        '@id': 'sec:owner',
        '@type': '@id',
      },
      permission: 'sec:permission',
      permittedProofType: 'sec:permittedProofType',
      privateKey: {
        '@id': 'sec:privateKey',
        '@type': '@id',
      },
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
      revoked: {
        '@id': 'sec:revoked',
        '@type': 'xsd:dateTime',
      },
      seeAlso: {
        '@id': 'rdfs:seeAlso',
        '@type': '@id',
      },
      service: {
        '@id': 'sec:service-endpoints',
        '@type': '@id',
        '@container': '@set',
      },
      serviceEndpoint: 'sec:dfn-service-endpoints',
      signature: 'sec:signature',
      signatureAlgorithm: 'sec:signatureAlgorithm',
      signatureValue: 'sec:signatureValue',
      updated: {
        '@id': 'didv:updated',
        '@type': 'xsd:dateTime',
      },
    },
  ],
  id:
    'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93',
  authentication: [
    'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93#keys-1',
  ],
  publicKey: [
    {
      controller:
        'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93',
      id:
        'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93#keys-1',
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyHex:
        '02112a1c1cd7d150a974c0f3a48033329fb13b24bfe5f998f55f8c31539130ab8b',
    },
    {
      controller: [
        'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93#keys-3',
      ],
      id: 'urn:uuid:38789e03-d277-43b8-892d-35a9fdb88e39',
      type: 'X25519KeyAgreementKey2019',
      publicKeyHex:
        'b9232b7bcb6be27d2b06a31da7edb0987b02bf9144ae94215bf1ca18ee398c27',
    },
  ],
  service: [],
  created: '2020-08-28T17:42:27.602Z',
  updated: '2020-08-28T17:42:27.605Z',
  proof: {
    created: '2020-08-28T17:42:27.605Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: 'fe873bd8695add19',
    signatureValue:
      '7ad5a21150e9be7a1c0b095768bbdb94afe1f23723d865206ecbc1e0326d17243dbf1b72f4f7964df168a42da685583c3be83741a9c7e03aa5bea396582ef5c6',
    creator:
      'did:jolo:460146327f800ad854d73f18acfa482ddfcaa4427fce8e24b64eca473c833e93#keys-1',
  },
}
