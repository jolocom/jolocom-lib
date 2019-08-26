import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { validateJsonLd } from '../../ts/validation/validation'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { MultiResolver } from '../../ts/resolver'
import { IDidDocumentAttrs } from '../../ts/identity/didDocument/types'

chai.use(sinonChai)
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

const DID_DOC_V0_13 = {
  specVersion: 0.13,
  '@context': [
    'https://www.w3.org/2019/did/v1',
    'https://w3id.org/did/v0.11',
    'https://w3id.org/did/v1',
    { EcdsaKoblitzSignature2016: 'sec:EcdsaKoblitzSignature2016' },
    {
      xsd: 'http://www.w3.org/2001/XMLSchema#',
      sec: 'https://w3id.org/security#',
      schema: 'http://schema.org/',
      didv: 'https://w3id.org/did#',
      publicKeyHex: 'sec:publicKeyHex',
      updated: { '@id': 'didv:updated', '@type': 'xsd:dateTime' },
      specVersion: 'schema:version',
      Secp256k1VerificationKey2018: 'sec:Secp256k1VerificationKey2018',
      JolocomPublicProfile: 'https://identity.jolocom.com/terms/PublicProfile',
    },
  ],
  id:
    'did:jolo:1ff29fd63b896ca94b5efe35bd61eba809b5293a1cdf995dfa9cc7a8a8e1c348',
  authentication: [
    'did:jolo:1ff29fd63b896ca94b5efe35bd61eba809b5293a1cdf995dfa9cc7a8a8e1c348#keys-1',
  ],
  publicKey: [
    {
      controller:
        'did:jolo:1ff29fd63b896ca94b5efe35bd61eba809b5293a1cdf995dfa9cc7a8a8e1c348',
      id:
        'did:jolo:1ff29fd63b896ca94b5efe35bd61eba809b5293a1cdf995dfa9cc7a8a8e1c348#keys-1',
      type: 'Secp256k1VerificationKey2018',
      publicKeyHex:
        '031cb4105e392208c78085cb618a2695ee4e732534bc8f6b2f699f116c9607b84d',
    },
  ],
  service: [],
  created: '2019-08-10T13:56:40.240Z',
  updated: '2019-08-10T13:56:40.934Z',
  proof: {
    created: '2019-08-10T13:56:40.934Z',
    type: 'EcdsaKoblitzSignature2016',
    nonce: '730c39662aa79d17',
    signatureValue:
      'edcffa601bfbe5ece45c513799e34b5a8d957ce7eb94441efc250f7ba7749d10424a0d7f54ba8837b89f804fed52992cf1ac00d874b5215068876a6345359394',
    creator:
      'did:jolo:1ff29fd63b896ca94b5efe35bd61eba809b5293a1cdf995dfa9cc7a8a8e1c348#keys-1',
  },
}

describe('Utils/Validation functions', () => {
  it('validateJsonLd should correctly validate, maintaining backwards compatibility', async () => {
    const identityFromDidDoc = (didDoc: IDidDocumentAttrs) =>
      Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(didDoc),
      })

    const mockResolver = new MultiResolver({
      jolo: async did =>
        did === DID_DOC_V0.id
          ? identityFromDidDoc(DID_DOC_V0)
          : identityFromDidDoc(DID_DOC_V0_13),
    })

    const mallformedV0 = {
      ...DID_DOC_V0,
      proof: {
        ...DID_DOC_V0.proof,
        nonce: '0',
      },
    }

    const mallformedV013 = {
      ...DID_DOC_V0_13,
      proof: {
        ...DID_DOC_V0_13.proof,
        nonce: '0',
      },
    }

    expect(await validateJsonLd(DID_DOC_V0, mockResolver)).to.eq(true)
    expect(await validateJsonLd(DID_DOC_V0_13, mockResolver)).to.eq(true)

    expect(await validateJsonLd(mallformedV0, mockResolver)).to.eq(false)
    expect(await validateJsonLd(mallformedV013, mockResolver)).to.eq(false)
  })
})
