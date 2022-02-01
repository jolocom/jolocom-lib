import { ICredentialAttrs } from '@jolocom/protocol-ts'
import assert from 'assert'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { SignedCredential } from './signedCredential'
import { Credential } from './credential'
import {
  LinkedDataProof,
  SupportedSuites,
  BaseProofOptions,
} from '../../linkedDataSignature'
import { ProofOptions } from '../../linkedDataSignature/types'
import { SuiteImplementation } from '../../linkedDataSignature/mapping'
import { ChainedProof2021 } from '../../linkedDataSignature/suites/chainedProof2021'

type ExtendedSuites = typeof SuiteImplementation & {
  [SupportedSuites.ChainedProof2021]: {
    impl: typeof ChainedProof2021
    customArgs: {
      chainSignatureSuite: SupportedSuites
      previousProof: LinkedDataProof<BaseProofOptions>
    }
  }
}

type GenerateProofArgs<T extends SupportedSuites> = {
  proofOptions: ProofOptions
  proofSpecificOptions: ExtendedSuites[T]['customArgs']
}

export class CredentialSigner {
  private credential: Credential = null
  private proofs: Array<LinkedDataProof<BaseProofOptions>> = []
  private issuanceMetadata: Partial<{
    expiry: Date
    issuance: Date
    issuer: string
  }> = {}

  static fromCredentialJSON(json: ICredentialAttrs) {
    return CredentialSigner.fromCredential(Credential.fromJSON(json))
  }

  private setCredential(credential: Credential) {
    if (!this.credential) {
      assert(credential.id, new Error('credential identifier must be present'))
      assert(
        credential.context[0] === 'https://www.w3.org/2018/credentials/v1',
        new Error(
          'context must be one or more URIs, first URI must be https://www.w3.org/2018/credentials/v1'
        )
      )
      assert(
        credential.type.length > 1 &&
          credential.type[0] === 'VerifiableCredential',
        new Error(
          'Type must contain at least two entries, first must be VerifiableCredential'
        )
      )
      assert(
        credential.credentialSubject.id,
        new Error(
          'credentialSubject section must be present. Multiple subjects are not supported.'
        )
      )

      this.credential = credential
    }
    return this
  }

  getCredential(): Credential {
    return Object.assign({}, this.credential)
  }

  setIssuer(issuer: string) {
    this.issuanceMetadata.issuer = issuer
    return this
  }

  setDates(issuance: Date, expiry: Date) {
    this.issuanceMetadata = {
      ...this.issuanceMetadata,
      expiry,
      issuance,
    }
    return this
  }

  addProof<P extends BaseProofOptions>(proof: LinkedDataProof<P>) {
    this.proofs.push(proof)
  }

  async generateProof<T extends SupportedSuites>(
    proofType: T,
    opts: GenerateProofArgs<T>,
    issuer: IdentityWallet,
    pass: string
  ): Promise<LinkedDataProof<BaseProofOptions>> {
    this.ensureReadyToIssue()

    const { proof, ...document } = this.toSignedCredential().toJSON()

    const suiteImpl = ({
      [SupportedSuites.ChainedProof2021]: {
        impl: ChainedProof2021,
        customArgs: {} as {
          chainSignatureSuite: SupportedSuites
          previousProof: LinkedDataProof<BaseProofOptions>
        },
      },
      ...SuiteImplementation,
    } as ExtendedSuites)[proofType]

    if (!suiteImpl) {
      throw new Error(`Signature suite ${proofType} not suported`)
    }

    const ldSig = suiteImpl.impl.create(opts.proofOptions)

    const ldProof = (await ldSig.derive(
      {
        document,
        previousProofs: this.proofs,
      },
      opts.proofSpecificOptions,
      issuer,
      pass
    )) as LinkedDataProof<BaseProofOptions>
    this.addProof(ldProof)
    return ldProof
  }

  private ensureReadyToIssue() {
    assert(this.credential, 'no credential set')
    assert(this.issuanceMetadata.issuer, 'issuer not set')
    assert(
      this.issuanceMetadata.issuance && this.issuanceMetadata.expiry,
      'issuance and expiry dates not set'
    )
    return
  }

  private setProofs(proofS: LinkedDataProof<BaseProofOptions>[]) {
    proofS.forEach((p) => {
      p && this.addProof(p)
    })
    return this
  }

  toSignedCredential(): SignedCredential {
    this.ensureReadyToIssue()
    const signedCred = this.credential.toVerifiableCredential()
    signedCred.issuer = this.issuanceMetadata.issuer
    signedCred.expires = this.issuanceMetadata.expiry
    signedCred.issued = this.issuanceMetadata.issuance
    signedCred.proof = this.proofs.filter((p) => !!p)
    return signedCred
  }

  static fromCredential(credential: Credential) {
    return new CredentialSigner().setCredential(credential)
  }

  static fromSignedCredential(signedCredential: SignedCredential) {
    return new CredentialSigner()
      .setCredential(signedCredential)
      .setDates(signedCredential.issued, signedCredential.expires)
      .setIssuer(signedCredential.issuer)
      .setProofs(signedCredential.proof)
  }
}
