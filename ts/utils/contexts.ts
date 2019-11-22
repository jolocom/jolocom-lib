import { JsonLdContextEntry } from '../linkedData/types'

/* Expanded default context for verifiable credentials, more verbose, but works in offline use cases */

export const defaultContext: JsonLdContextEntry[] = [
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
]

/* Expanded default context for did documents, more verbose, but works in offline use cases */

export const defaultContextIdentity: JsonLdContextEntry[] = [
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
    publicKey: { '@id': 'sec:publicKey', '@type': '@id', '@container': '@set' },
    publicKeyHex: 'sec:publicKeyHex',
    requiredProof: 'sec:requiredProof',
    revoked: { '@id': 'sec:revoked', '@type': 'xsd:dateTime' },
    signature: 'sec:signature',
    signatureAlgorithm: 'sec:signatureAlgorithm',
    signatureValue: 'sec:signatureValue',
  },
]
