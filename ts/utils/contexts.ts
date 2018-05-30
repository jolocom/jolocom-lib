export const defaultContext = {
  id: '@id',
  type: '@type',
  cred: 'https://w3id.org/credentials#',
  schema: 'http://schema.org/',
  sec: 'https://w3id.org/security#',
  dc: 'http://purl.org/dc/terms/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  jolo: 'https://www.identity.jolocom.com/terms/',

  proof: { '@id': 'sec:proof', '@type': '@id' },
  EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016',
  created: { '@id': 'dc:created', '@type': 'xsd:dateTime' },
  creator: { '@id': 'dc:creator', '@type': '@id' },
  domain: 'sec:domain',
  nonce: 'sec:nonce',
  signatureValue: 'sec:signatureValue',

  Credential: 'cred:Credential',
  ProofOfEmailCredential: 'jolo:ProofOfEmailCredential',
  ProofOfMobilePhoneNumberCredential: 'jolo:ProofOfMobilPhoneNumberCredential',
  issuer: { '@id': 'cred:issuer', '@type': '@id' },
  issued: { '@id': 'cred:issued', '@type': 'xsd:dateTime' },

  claim: { '@id': 'cred:claim', '@type': '@id' },
  telephone: 'schema:telephone',
  email: 'schema:email',
}
