import * as chai from 'chai'
import { SignedCredential } from '../../../ts/credentials/v1.1/signedCredential'
import { CredentialSigner } from '../../../ts/credentials/v1.1/credentialSigner'
import { CredentialVerifier } from '../../../ts/credentials/v1.1/credentialVerifier'
import { example1 } from '../../data/credential/signedCredential.data'
import { expect } from 'chai'
import { mockEmailCredCreationAttrs } from '../../data/credential/credential.data'
import { LocalDidMethod } from '../../../ts/didMethods/local'
import { SupportedSuites } from '../../../ts/linkedDataSignature'
import { Credential } from '../../../ts/credentials/v1.1/credential'

chai.use(require('sinon-chai'))

describe('VC Builder tests', () => {
  it('Creates a simple example from JSON', async () => {
    const builder = CredentialSigner.fromSignedCredential(
      SignedCredential.fromJSON(example1)
    )

    const { identityWallet } = await new LocalDidMethod().recoverFromSeed(
      Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
      'pass'
    )

    const p1 = await builder.generateProof(
      SupportedSuites.Ed25519Signature2018,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {},
      },
      identityWallet,
      'pass'
    )

    const p2 = await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: {
            type: p1.proofType,
            verificationMethod: p1.verificationMethod,
            created: p1.created,
            proofPurpose: p1.proofPurpose,
          },
          chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        },
      },
      identityWallet,
      'pass'
    )

    const p3 = await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: {
            type: p2.proofType,
            verificationMethod: p2.verificationMethod,
            created: p2.created,
            proofPurpose: p2.proofPurpose,
          },
          chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
        },
      },
      identityWallet,
      'pass'
    )

    await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: {
            type: p3.proofType,
            verificationMethod: p3.verificationMethod,
            created: p3.created,
            proofPurpose: p3.proofPurpose,
          },
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
        },
      },
      identityWallet,
      'pass'
    )

    const verifier = new CredentialVerifier([identityWallet])

    const vc = SignedCredential.fromJSON(builder.toSignedCredential().toJSON())
    const verificationResults = await verifier.generateVerificationReport(vc)

    expect(verificationResults[0].valid).to.eq(true)
    expect(verificationResults[1].valid).to.eq(true)
    expect(verificationResults[2].valid).to.eq(true)
    expect(verificationResults[3].valid).to.eq(true)

    expect(verificationResults[1].referencedProofValid).to.eq(true)
    expect(verificationResults[2].referencedProofValid).to.eq(true)
    expect(verificationResults[3].referencedProofValid).to.eq(true)

    vc.id = 'dsadsa'

    const resultsAfterModification = await verifier.generateVerificationReport(vc)

    expect(resultsAfterModification[0].valid).to.eq(false)
    expect(resultsAfterModification[1].valid).to.eq(true)
    expect(resultsAfterModification[2].valid).to.eq(true)
    expect(resultsAfterModification[3].valid).to.eq(true)

    expect(resultsAfterModification[1].referencedProofValid).to.eq(false)
    expect(resultsAfterModification[2].referencedProofValid).to.eq(false)
    expect(resultsAfterModification[3].referencedProofValid).to.eq(false)
  })

  it('Creates a simple example', async () => {
    const { identityWallet } = await new LocalDidMethod().recoverFromSeed(
      Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex'),
      'pass'
    )

    const credential = Credential.build(mockEmailCredCreationAttrs)
    let builder = CredentialSigner.fromCredential(credential)

    const [issued, expires] = getIssuanceExpiryDates()
    builder.setDates(issued, expires)
    builder.setIssuer(identityWallet.publicKeyMetadata.signingKeyId)

    const p1 = await builder.generateProof(
      SupportedSuites.Ed25519Signature2018,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: undefined,
      },
      identityWallet,
      'pass'
    )

    await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
          previousProof: {
            type: p1.proofType,
            verificationMethod: p1.verificationMethod,
            created: p1.created,
            proofPurpose: p1.proofPurpose,
          },
        },
      },
      identityWallet,
      'pass'
    )

    const BREAK = SignedCredential.fromJSON(
      builder.toSignedCredential().toJSON()
    )
    console.log({ BREAK: builder.toSignedCredential().toJSON().proof[1] })

    builder = CredentialSigner.fromSignedCredential(BREAK)

    const p3 = await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
          previousProof: {
            proofPurpose: BREAK.proof[1].proofPurpose,
            type: BREAK.proof[1].proofType,
            verificationMethod: BREAK.proof[1].verificationMethod,
            created: BREAK.proof[1].created,
          },
        },
      },
      identityWallet,
      'pass'
    )

    await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          chainSignatureSuite: SupportedSuites.Ed25519Signature2018,
          previousProof: {
            type: p3.proofType,
            verificationMethod: p3.verificationMethod,
            created: p3.created,
            proofPurpose: p3.proofPurpose,
          },
        },
      },
      identityWallet,
      'pass'
    )

    const verifier = new CredentialVerifier([identityWallet])
    const vc = builder.toSignedCredential()

    await verifier.verifyProofAtIndex(vc, 3)
    const verificationResults = await verifier.generateVerificationReport(vc)
    console.log({ verificationResults })
    expect(verificationResults[0].valid).to.eq(true)
    expect(verificationResults[1].valid).to.eq(true)
    expect(verificationResults[1].referencedProofValid).to.eq(true)

    vc.expires = new Date()

    const resultsAfterModification = await verifier.generateVerificationReport(vc)
    console.log({ resultsAfterModification })
    expect(resultsAfterModification[0].valid).to.eq(false)
    expect(resultsAfterModification[1].valid).to.eq(true)
    expect(resultsAfterModification[1].referencedProofValid).to.eq(false)
  })
})

const getIssuanceExpiryDates = () => {
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 5)

  const issued = new Date()

  return [issued, expires]
}
