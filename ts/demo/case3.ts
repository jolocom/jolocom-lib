import { SupportedSuites } from '../linkedDataSignature'
import { CredentialSigner } from '../credentials//v1.1/credentialSigner'
import { CredentialVerifier } from '../credentials//v1.1/credentialVerifier'
import { IdentityWallet } from '../identityWallet/identityWallet'
import assert from 'assert'

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
// Case 3. A VC with existing proofs is received as JSON, new signature is added, the VC is tampered with, verification should fail.
export const case3 = async (signer: IdentityWallet, pass: string, verifier: CredentialVerifier) => {
  const credentialSigner = CredentialSigner.fromSignedCredential(
    JSON_CREDENTIAL_WITH_PROOF
  )

  const p1 = credentialSigner.proofs[0]

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

  const verificationResults = await verifier.verifyAllProofs(finalCredential)

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

  const alteredVerificationResults = await verifier.verifyAllProofs(finalCredential)
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

const wait = (duration = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), duration * 1000)
  })
}