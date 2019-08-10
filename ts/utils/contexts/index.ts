import { JsonLdContextEntry } from './types'

const commonCustomTerms = {
  EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
}

const identityCustomTerms = {
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  sec: 'https://w3id.org/security#',
  schema: 'http://schema.org/',
  didv: 'https://w3id.org/did#',
  publicKeyHex: 'sec:publicKeyHex',
  updated: { '@id': 'didv:updated', '@type': 'xsd:dateTime' },
  specVersion: 'schema:version',
  Secp256k1VerificationKey2018: 'sec:Secp256k1VerificationKey2018',
  JolocomPublicProfile: 'https://identity.jolocom.com/terms/PublicProfile',
}

const credentialCustomTerms = {
  cred: 'https://w3id.org/credentials#',
  claim: { '@id': 'cred:claim', '@type': '@id' },
  Credential: 'cred:Credential',
  issuer: { '@id': 'cred:issuer', '@type': '@id' },
  issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },
}

interface ContextMap {
  specMandated: JsonLdContextEntry[]
  published: JsonLdContextEntry[]
  extendedDefinitions: JsonLdContextEntry[]
}

export const identityContextMap: ContextMap = {
  specMandated: ['https://www.w3.org/2019/did/v1'],
  published: ['https://w3id.org/did/v0.11', 'https://w3id.org/did/v1'],
  extendedDefinitions: [commonCustomTerms, identityCustomTerms],
}

export const didDocumentContext = identityContextMap.specMandated
  .concat(identityContextMap.published)
  .concat(identityContextMap.extendedDefinitions)

export const credentialContextMap: ContextMap = {
  specMandated: [],
  published: ['https://w3id.org/did/v0.11', 'https://w3id.org/did/v1'],
  extendedDefinitions: [commonCustomTerms, credentialCustomTerms],
}

export const signedCredentialContext = credentialContextMap.specMandated
  .concat(credentialContextMap.published)
  .concat(credentialContextMap.extendedDefinitions)
