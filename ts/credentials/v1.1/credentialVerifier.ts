import { IdentityWallet } from '../../identityWallet/identityWallet'
import { SignedCredential } from './signedCredential'
import {
  LinkedDataProof,
  SupportedSuites,
  BaseProofOptions,
} from '../../linkedDataSignature'
import { ErrorCodes } from '../../linkedDataSignature/suites/chainedProof2021'
import { Identity } from '../../identity/identity'

export class CredentialVerifier {
  private signerIdentities: { [k: string]: Identity } = {}

  constructor(signers: IdentityWallet[]) {
    signers.forEach((id) => {
      this.signerIdentities[id.publicKeyMetadata.signingKeyId] = id.identity
    })
  }

  public async verifyProofAtIndex(credential: SignedCredential, index: number) {
    const ldProof = credential.proof[index]
    if (!ldProof) {
      throw new Error(`Proof at index ${index} not found.`)
    }
    const { proof, ...document } = credential.toJSON()
    const verifier = this.signerIdentities[ldProof.verificationMethod]

    if (!verifier) {
      throw new Error(`No Identity found for did ${ldProof.verificationMethod}`)
    }

    return await ldProof.verify(
      {
        document,
      },
      verifier
    )
  }

  public addSignerIdentity(signer: Identity) {
    this.signerIdentities[signer.did] = signer
  }

  public async verifyAllProofs(credential: SignedCredential) {
    return this.verLoop(credential, credential.proof)
  }

  private async verLoop(
    credential: SignedCredential,
    [toVerify, ...otherProofs]: LinkedDataProof<BaseProofOptions>[],
    report: {} = {}
  ) {
    if (!toVerify) {
      return report
    }

    const index = credential.proof.indexOf(toVerify)

    report[index] = {
      valid: true,
      type: toVerify.proofType,
      verificationMethod: toVerify.verificationMethod,
      ...(toVerify.proofType === SupportedSuites.ChainedProof2021
        ? { referencedProofValid: true }
        : {}),
    }

    try {
      const result = await this.verifyProofAtIndex(credential, index)

      if (!result) {
        throw new Error('SignatureVerificationFailed')
      }

      report[index] = {
        ...report[index],
        valid: result,
      }
    } catch (e) {
      if (e.message === ErrorCodes.InnerSignatureVerificationFailed) {
        report[index] = {
          ...report[index],
          valid: true,
          referencedProofValid: false,
          error: e.message,
        }
      } else if (
        e.message === ErrorCodes.ChainAndInnerSignatureVerificationFailed
      ) {
        report[index] = {
          ...report[index],
          valid: false,
          referencedProofValid: false,
          error: e.message,
        }
      } else {
        report[index] = {
          ...report[index],
          valid: false,
          referencedProofValid: true,
          error: e.message,
        }
      }
    }

    return this.verLoop(credential, otherProofs, report)
  }
}
