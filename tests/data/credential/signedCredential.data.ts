import { claimsMetadata } from '@jolocom/protocol-ts'
import { defaultContext } from '../../../ts/utils/contexts'

export const mockKeyId =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1'
export const mockIssuerDid =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const mockSubject =
  'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const emailVerifiableCredentialHash =
  '7d659e5e3088453ba7e668297efdd985e74a49cebd3ce1f9951a09ee74530011'
export const emailVerifiableCredential = {
  '@context': [...defaultContext, ...claimsMetadata.emailAddress.context],
  id: 'claimId:1842fb5f567dd532',
  name: 'Email address',
  issuer: mockIssuerDid,
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { email: 'test@jolocom.io', id: mockSubject },
  issued: '1970-01-01T00:00:00.000Z',
  expires: '1971-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f567dd532',
    signatureValue: '',
    created: '1970-01-01T00:00:00.000Z',
  },
}

// Example data structures extracted from here - https://github.com/w3c/vc-test-suite/tree/gh-pages/test/vc-data-model-1.0/input
// Examples 009, 010, 011

export const example1 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "expirationDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Mechanical Engineering"
    }
  },
  "credentialSchema": {
    "id": "https://example.org/examples/degree.json",
    "type": "JsonSchemaValidator2018"
  },
  "proof": []
}

export const example2 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Mechanical Engineering"
    }
  },
  "credentialSchema": [
    {
      "id": "https://example.org/examples/degree.json",
      "type": "JsonSchemaValidator2018"
    },
    {
      "id": "https://example.org/examples/degree.zkp",
      "type": "ZkpExampleSchema2018"
    }
  ],
  "proof": {
    "type": "RsaSignature2018"
  }
}

export const example3 = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/58473",
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": "https://example.edu/issuers/14",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": [
    {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "alumniOf": "Example University"
    },
    {
      "id": "did:example:abcd123",
      "alumniOf": "Second Example University"
    }
  ],
  "proof": {
    "type": "RsaSignature2018"
  }
}