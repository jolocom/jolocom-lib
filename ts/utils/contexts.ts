import { ContextEntry } from 'cred-types-jolocom-core'

export const defaultContext: ContextEntry[] = [
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
    signatureValue: 'sec:signatureValue'
  }
]
