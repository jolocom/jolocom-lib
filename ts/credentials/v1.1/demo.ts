import { LocalDidMethod } from '../../didMethods/local'
import { SupportedSuites } from '../../linkedDataSignature'
import { CredentialSigner } from './credentialBuilder'
import { CredentialVerifier } from './credentialVerifier'
import { Credential } from './credential'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import assert from 'assert'

// Example data structure from -- https://github.com/w3c/vc-test-suite/blob/gh-pages/test/vc-data-model-1.0/input/example-009.jsonld
const JSON_CREDENTIAL = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
  ],
  id: 'http://example.edu/credentials/3732',
  type: ['VerifiableCredential', 'UniversityDegreeCredential'],
  issuer: 'https://example.edu/issuers/14',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    degree: {
      type: 'BachelorDegree',
      name: 'Bachelor of Science in Mechanical Engineering',
    },
  },
  credentialSchema: {
    id: 'https://example.org/examples/degree.json',
    type: 'JsonSchemaValidator2018',
  },
  proof: [],
}

// Example data structure generated by this library
const JSON_CREDENTIAL_WITH_PROOF = {
  credentialSubject: { email: 'example@mail.com', id: 'did:example:subject' },
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      ProofOfEmailCredential:
        'https://identity.jolocom.com/terms/ProofOfEmailCredential',
      schema: 'http://schema.org/',
      email: 'schema:email',
    },
  ],
  id: 'claimId:e64233e4f71ca107',
  issuer: 'did:jun:E9owvpwvhd59r32LMajuxqgTUZffqU9qxH4GN3jokf5s',
  issuanceDate: '2022-02-02T10:21:49Z',
  expirationDate: '2023-02-02T10:21:49Z',
  type: ['VerifiableCredential', 'ProofOfEmailCredential'],
  proof: [
    {
      proofPurpose: 'assertionMethod',
      created: '2022-02-02T10:21:49Z',
      type: 'Ed25519Signature2018',
      jws:
        'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Ky1aNIp24YnPg5qXfoEMdzDgsEc05oPoDV22-tq8_vXDWz6shqOOGCkewCMSf0ZD1C6V5walkOvRZGA7B1QdCQ',
      verificationMethod:
        'did:jun:E9owvpwvhd59r32LMajuxqgTUZffqU9qxH4GN3jokf5s#D2UI8qsT_W3L_zHZeMOJt2LzjK-Z2KhBrYKjGEW-q6d8',
    },
  ],
}

// Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable.
const case1 = async (signer: IdentityWallet, pass: string) => {
  // Create a new instance of a verifiable credential (alternatively Credential.fromJSON can be used as well)
  const credential = Credential.build({
    metadata: claimsMetadata.emailAddress,
    claim: {
      email: 'example@mail.com',
    },
    subject: 'did:example:subject',
  })

  // Instantiate a signer / proof builder based on the credential, configure relevant metadata
  const credentialSigner = CredentialSigner.fromCredential(credential)
  credentialSigner.setIssuer(signer.did)
  credentialSigner.generateDates()

  // Generate and add a Ed25519Signature2018 proof node to the Verifiable Credential
  const p1 = await credentialSigner.generateProof(
    SupportedSuites.Ed25519Signature2018,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {},
    },
    signer,
    pass
  )

  // Generate and add a ChainedProof2021 proof node to the Verifiable Credential
  await credentialSigner.generateProof(
    SupportedSuites.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        // References the previously created Ed25519Signature proof node
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  await credentialSigner.generateProof(
    SupportedSuites.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
        // References the previously created Ed25519Signature proof node
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  // Render the assembled VC, should contain the original VC body, and the two newly created proofs.
  const finalCredential = credentialSigner.toSignedCredential()
  console.log('Signed Credential with newly added proofs:')
  console.log(finalCredential.toJSON())

  await new CredentialVerifier([signer]).verifyProofAtIndex(finalCredential, 1)

  // Verify all proofs on the VC, the returned report should mark all proofs as valid
  const verificationResults = await new CredentialVerifier([
    signer,
  ]).verifyAllProofs(finalCredential)
  console.log('Verification results, if the signed contents are not modified:')
  console.log(verificationResults)

  // Assert all proofs are valid
  assert(verificationResults[0].valid)
  assert(verificationResults[1].valid)
  assert(verificationResults[1].proofMetadata.referencedProofValid)

  // Alter the contents of the credential
  finalCredential.issuer = 'modifiedIssuer'

  // Verify all proofs on the modified credential, should mark certain proofs as invalid.
  const alteredVerificationResults = await new CredentialVerifier([
    signer,
  ]).verifyAllProofs(finalCredential)

  console.log('Verification results, if the signed contents are modified:')
  console.log(alteredVerificationResults)

  // Content of the document was altered.
  assert(alteredVerificationResults[0].valid === false)

  // Content of P1 or P2 was not altered
  assert(alteredVerificationResults[1].valid)
  assert(
    alteredVerificationResults[1].proofMetadata.referencedProofValid === false
  )
}

// Case 2. A VC without proofs is received as JSON. Two proofs are added. All signatures are verifiable.
const case2 = async (signer: IdentityWallet, pass: string) => {
  const credentialSigner = CredentialSigner.fromSignedCredential(
    JSON_CREDENTIAL
  )

  // Generate and add a Ed25519Signature2018 node to the document
  const p1 = await credentialSigner.generateProof(
    SupportedSuites.Ed25519Signature2018,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {},
    },
    signer,
    pass
  )

  // Add a ChainedProof2021 proof node to the Verifiable Credential, referencing an existing proof.
  await credentialSigner.generateProof(
    SupportedSuites.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        // Reference a proof node which was created at an earlier point and included in the received credential.
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  // Render the assembled VC, should contain the original VC body, and the two newly created proofs.
  const finalCredential = credentialSigner.toSignedCredential()
  console.log('Signed Credential with newly added proofs:')
  console.log(finalCredential.toJSON())
  console.log('Proofs associated with the credential:')
  console.log(finalCredential.toJSON().proof)

  // Verify all proofs on the VC, the returned report should mark all proofs as valid
  const verificationResults = await new CredentialVerifier([
    signer,
  ]).verifyAllProofs(finalCredential)
  console.log('Verification results, if the signed contents are not modified:')
  console.log(verificationResults)

  // Assert all proofs are valid
  assert(verificationResults[0].valid)
  assert(verificationResults[1].valid)
  assert(verificationResults[1].proofMetadata.referencedProofValid)
}

// Case 3. A VC with existing proofs is received as JSON, new signature is added, the VC is tampered with, verification should fail.
const case3 = async (signer: IdentityWallet, pass: string) => {
  const credentialSigner = CredentialSigner.fromSignedCredential(
    JSON_CREDENTIAL_WITH_PROOF
  )

  const p1 = credentialSigner.ldProofs[0]

  const p2 = await credentialSigner.generateProof(
    SupportedSuites.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        previousProof: {
          verificationMethod: p1.verificationMethod,
          created: p1.created,
          proofPurpose: p1.proofPurpose,
          type: p1.proofType,
        },
      },
    },
    signer,
    pass
  )

  await wait(1)

  await credentialSigner.generateProof(
    SupportedSuites.ChainedProof2021,
    {
      proofOptions: {
        verificationMethod: signer.publicKeyMetadata.signingKeyId,
      },
      proofSpecificOptions: {
        chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        previousProof: {
          verificationMethod: p2.verificationMethod,
          created: p2.created,
          proofPurpose: p2.proofPurpose,
          type: p2.proofType,
        },
      },
    },
    signer,
    pass
  )

  // Render the assembled VC, should contain the original VC and proof, and the newly created proof.
  const finalCredential = credentialSigner.toSignedCredential()
  console.log('Signed Credential with newly added proofs:')
  console.log(finalCredential.toJSON())

  const verificationResults = await new CredentialVerifier([
    signer,
  ]).verifyAllProofs(finalCredential)

  console.log('Verification results, if the signed contents are not modified:')
  console.log(verificationResults)

  // Assert all signatures are valid, the content was not modified
  assert(verificationResults[0].valid)
  assert(verificationResults[1].valid)
  assert(verificationResults[1].proofMetadata.referencedProofValid)
  assert(verificationResults[2].valid)
  assert(verificationResults[2].proofMetadata.referencedProofValid)

  // Alter the credential, should lead to p1 being invalid.
  finalCredential.credentialSubject.id = 'did:malicious:attacker'

  const alteredVerificationResults = await new CredentialVerifier([
    signer,
  ]).verifyAllProofs(finalCredential)
  console.log('Verification results, if the signed contents were modified:')
  console.log(alteredVerificationResults)

  assert(alteredVerificationResults[0].valid === false)
  assert(alteredVerificationResults[1].valid)
  assert(
    alteredVerificationResults[1].proofMetadata.referencedProofValid === false
  )
  assert(alteredVerificationResults[2].valid)
  assert(alteredVerificationResults[2].proofMetadata.referencedProofValid)
}

const runTest = async () => {
  const PASS = 'pass'

  const { identityWallet } = await new LocalDidMethod().recoverFromSeed(
    Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
    PASS
  )

  console.log(
    'Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable.'
  )
  await case1(identityWallet, PASS)

  console.log(
    'Case 2. A VC without proofs is received as JSON. Two proofs are added. All signatures are verifiable.'
  )
  await case2(identityWallet, PASS)

  console.log(
  'Case 3. A VC with existing proofs is received as JSON, new signature is added, the VC is tampered with, verification should fail'
  )
  await case3(identityWallet, PASS)
}

runTest()

const wait = (duration = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), duration * 1000)
  })
}