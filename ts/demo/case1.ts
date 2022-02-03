import { SupportedSuites } from '../linkedDataSignature'
import { CredentialSigner } from '../credentials//v1.1/credentialSigner'
import { CredentialVerifier } from '../credentials//v1.1/credentialVerifier'
import { Credential } from '../credentials//v1.1/credential'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { IdentityWallet } from '../identityWallet/identityWallet'
import assert from 'assert'

// Case 1. A new VC is created from scratch, using this library. Two signatures are added. Both signatures are verifiable.
export const case1 = async (
  signer: IdentityWallet,
  pass: string,
  verifier: CredentialVerifier
) => {
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
  credentialSigner.generateAndSetDates()

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

  await verifier.verifyProofAtIndex(finalCredential, 1)

  // Verify all proofs on the VC, the returned report should mark all proofs as valid
  const verificationResults = await verifier.verifyAllProofs(finalCredential)
  console.log('Verification results, if the signed contents are not modified:')
  console.log(verificationResults)

  // Assert all proofs are valid
  assert(verificationResults[0].valid)
  assert(verificationResults[1].valid)
  assert(verificationResults[1].proofMetadata.referencedProofValid)

  // Alter the contents of the credential
  finalCredential.issuer = 'modifiedIssuer'

  // Verify all proofs on the modified credential, should mark certain proofs as invalid.
  const alteredVerificationResults = await verifier.verifyAllProofs(finalCredential)

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
