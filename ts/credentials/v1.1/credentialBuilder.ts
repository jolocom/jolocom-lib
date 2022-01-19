import { BaseMetadata, ILinkedDataSignature, ISignedCredCreationArgs } from "@jolocom/protocol-ts"
import assert from "assert"
import { randomBytes } from "crypto"
import { IdentityWallet } from "../../identityWallet/identityWallet"
import { SignedCredential } from "./signedCredential"
import { Credential } from "./credential"

export class CredentialBuilder {
  private credential: Credential = null
  private proofs: ILinkedDataSignature[] = []
  private issuanceMetadata: Partial<{
    expiry: Date,
    issuance: Date,
    issuer: string
  }> = {}


  static fromClaimWithMetadata<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>) {
    return this.fromCredential(Credential.build(credentialOptions))
  }

  setCredential(credential: Credential) {
    if (!this.credential) {
      this.credential = credential
    }
    return this
  }

  getCredential(): Credential {
    return Object.assign({}, this.credential)
  }

  setIssuer(issuer: string) {
    this.issuanceMetadata.issuer = issuer
  }

  setDates(issuance: Date, expiry: Date) {
    this.issuanceMetadata = {
      ...this.issuanceMetadata,
      expiry,
      issuance
    }
    return this
  }

  addProof(proof: ILinkedDataSignature) {
    this.proofs.push(proof)
  }

  async generateProof(proofType: ILinkedDataSignature, issuer: IdentityWallet, pass: string) {
    this.ensureReadyToIssue()

    const { proof, ...document } = this.toSignedCredential().toJSON()

    //@ts-ignore Derive not defined in protocol-ts, lift definition
    const ldProof = await proofType.derive({
      document,
      previousProofs: this.proofs,
      proofOptions: {
        verificationMethod: this.issuanceMetadata.issuer,
        created: new Date()
      }
    }, issuer, pass)

    this.addProof(ldProof)
    return ldProof
  }

  private ensureReadyToIssue() {
    assert(this.credential, 'no credential set')
    assert(this.issuanceMetadata.issuer, 'issuer not set')
    return
  }

  toSignedCredential(): SignedCredential {
    this.ensureReadyToIssue()
    const signedCred = this.credential.toVerifiableCredential()
    signedCred.issuer = this.issuanceMetadata.issuer
    signedCred.expires = this.issuanceMetadata.expiry
    signedCred.issued = this.issuanceMetadata.issuance
    signedCred.proof = this.proofs
    return signedCred
  }

  static fromCredential(credential: Credential) {
    return new CredentialBuilder().setCredential(credential)
  }
}
