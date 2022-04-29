import * as chai from 'chai'
import { validateJsonLd } from '../../ts/linkedData'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { IResolver } from '../../ts/didMethods/types'

chai.use(require('sinon-chai'))
const expect = chai.expect

const DID_DOC_V0 = {
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
    'did:jolo:d74f9e9c9a405e87352211afc9575e6dc8aa99ae8870c1bbcc2adf68084d80f4',
  authentication: [
    {
      publicKey:
        'did:jolo:d74f9e9c9a405e87352211afc9575e6dc8aa99ae8870c1bbcc2adf68084d80f4#keys-1',
      type: 'Secp256k1SignatureAuthentication2018',
    },
  ],
  publicKey: [
    {
      owner:
        'did:jolo:d74f9e9c9a405e87352211afc9575e6dc8aa99ae8870c1bbcc2adf68084d80f4',
      id:
        'did:jolo:d74f9e9c9a405e87352211afc9575e6dc8aa99ae8870c1bbcc2adf68084d80f4#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex:
        '02c804dd5515c6ea8c22975425f8c5455c547e0c9df9990bcb03661b10e4c68cc8',
    },
  ],
  service: [],
  created: '2019-08-07T10:20:22.480Z',
  proof: {
    created: '2019-08-07T10:20:22.493Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: '4954e82afc9ed2ae',
    signatureValue:
      '85049aa73272be60204d4c6ee5f8f6a3a83d2bc8797282fe38f885fb98a208192c9e4a413f7aa2463cf29ff6ae3e85cbb3d1bcf5652fd4f35f01b73f7089477a',
    creator:
      'did:jolo:d74f9e9c9a405e87352211afc9575e6dc8aa99ae8870c1bbcc2adf68084d80f4#keys-1',
  },
}

describe('linkedData validation functions', () => {
  it('validateJsonLd should correctly validate', async () => {
    const testResolver: IResolver = {
      prefix: 'test',
      resolve: async () =>
        Identity.fromDidDocument({
          didDocument: DidDocument.fromJSON(DID_DOC_V0),
        }),
    }

    const mallformedV0 = {
      ...DID_DOC_V0,
      proof: {
        ...DID_DOC_V0.proof,
        nonce: '0',
      },
    }

    expect(await validateJsonLd(DID_DOC_V0, testResolver)).to.eq(true)
    expect(await validateJsonLd(mallformedV0, testResolver)).to.eq(false)
  })
})
