import { claimsMetadata } from 'cred-types-jolocom-core'
import { expect } from 'chai'
import { Credential } from '../../ts/credentials/credential/credential'
import {
  singleClaimCreationArgs,
  singleClaimCredentialJSON,
  multipleClaimsCreationArgs,
  multipleClaimsCredentialJSON,
  customClaimMetadata,
  customCredentialJSON
} from '../data/credential/credential'
import { EmailClaimMetadata, NameClaimMetadata } from 'cred-types-jolocom-core/js/types'

describe('Credential', () => {
  describe('static create method', () => {
    it('Should correctly assemble a credential given one claim', () => {
      const credential = Credential.create<EmailClaimMetadata>({
        metadata: claimsMetadata.emailAddress,
        claim: singleClaimCreationArgs,
        subject: 'did:jolo:test'
      })
      const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly assemble a credential given multiple claims', () => {
      const credential = Credential.create<NameClaimMetadata>({
        metadata: claimsMetadata.name,
        claim: multipleClaimsCreationArgs,
        subject: 'did:jolo:test'
      })
      const credentialFromJSON = Credential.fromJSON(multipleClaimsCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly assemble a custom credential', () => {
      const customCredential = Credential.create<typeof customClaimMetadata>({
        metadata: customClaimMetadata,
        claim: {
          age: '20'
        },
        subject: 'did:jolo:test'
      })
      const customCredentialFromJSON = Credential.fromJSON(customCredentialJSON)
      expect(customCredential).to.deep.equal(customCredentialFromJSON)
    })
  })

  it('Should implement all getter methods', () => {
    const credential = Credential.create<EmailClaimMetadata>({
      metadata: claimsMetadata.emailAddress,
      claim: singleClaimCreationArgs,
      subject: 'did:jolo:test'
    })

    expect(credential.getClaim()).to.deep.equal(singleClaimCreationArgs)
    expect(credential.getContext()).to.deep.equal(claimsMetadata.emailAddress.context)
    expect(credential.getName()).to.deep.equal(claimsMetadata.emailAddress.name)
    expect(credential.getType()).to.deep.equal(claimsMetadata.emailAddress.type)
  })

  it('Should implement static fromJSON method', () => {
    const credential = Credential.create<EmailClaimMetadata>({
      metadata: claimsMetadata.emailAddress,
      claim: singleClaimCreationArgs,
      subject: 'did:jolo:test'
    })

    const credFromJson = Credential.fromJSON(singleClaimCredentialJSON)
    expect(credential).to.deep.equal(credFromJson)

    const nameCredential = Credential.create<NameClaimMetadata>({
      metadata: claimsMetadata.name,
      claim: multipleClaimsCreationArgs,
      subject: 'did:jolo:test'
    })
    const nameCredentialFromJSON = Credential.fromJSON(multipleClaimsCredentialJSON)
    expect(nameCredential).to.deep.equal(nameCredentialFromJSON)
  })

  it('Should implement toJSON method', () => {
    const credential = Credential.create<EmailClaimMetadata>({
      metadata: claimsMetadata.emailAddress,
      claim: singleClaimCreationArgs,
      subject: 'did:jolo:test'
    })

    expect(credential.toJSON()).to.deep.equal(singleClaimCredentialJSON)
    const nameCredential = Credential.create<NameClaimMetadata>({
      metadata: claimsMetadata.name,
      claim: multipleClaimsCreationArgs,
      subject: 'did:jolo:test'
    })
    expect(nameCredential.toJSON()).to.deep.equal(multipleClaimsCredentialJSON)
  })
})
