import { expect } from 'chai'
import { Credential } from '../../ts/credentials/credential/index'
import { claimsMetadata } from '../../ts/index'
import {
  singleClaimCreationArgs,
  singleClaimCredentialJSON,
  multipleClaimsCreationArgs,
  multipleClaimsCredentialJSON,
  customClaimMetadata,
  customCredentialCreationArgs,
  customCredentialJSON
} from '../data/credential/credential'

describe('Credential', () => {
  describe('static create method', () => {
    it('Should correctly assemble a credential given one claim', () => {
      const credential = Credential.create(claimsMetadata.emailAddress, singleClaimCreationArgs)
      const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly assemble a credential given multiple claims', () => {
      const credential = Credential.create(claimsMetadata.name, multipleClaimsCreationArgs)
      const credentialFromJSON = Credential.fromJSON(multipleClaimsCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly assemble a custom credential', () => {
      const customCredential = Credential.create(customClaimMetadata, customCredentialCreationArgs)
      const customCredentialFromJSON = Credential.fromJSON(customCredentialJSON)
      expect(customCredential).to.deep.equal(customCredentialFromJSON)
    })

    it('Should throw in case not all claims are provided', () => {
      expect(() => Credential.create(claimsMetadata.emailAddress, { id: 'did:jolo:test' })).to.throw(
        'Missing claims, expected keys are: email'
      )
    })
  })

  it('Should implement all getter methods', () => {
    const credential = Credential.create(claimsMetadata.emailAddress, singleClaimCreationArgs)

    expect(credential.getClaim()).to.deep.equal(singleClaimCreationArgs)
    expect(credential.getContext()).to.deep.equal(claimsMetadata.emailAddress.context)
    expect(credential.getName()).to.deep.equal(claimsMetadata.emailAddress.name)
    expect(credential.getType()).to.deep.equal(claimsMetadata.emailAddress.type)
  })

  it('Should implement static fromJSON method', () => {
    const credential = Credential.create(claimsMetadata.emailAddress, singleClaimCreationArgs)
    const credFromJson = Credential.fromJSON(singleClaimCredentialJSON)
    expect(credential).to.deep.equal(credFromJson)

    const nameCredential = Credential.create(claimsMetadata.name, multipleClaimsCreationArgs)
    const nameCredentialFromJSON = Credential.fromJSON(multipleClaimsCredentialJSON)
    expect(nameCredential).to.deep.equal(nameCredentialFromJSON)
  })

  it('Should implement toJSON method', () => {
    const credential = Credential.create(claimsMetadata.emailAddress, singleClaimCreationArgs)
    expect(credential.toJSON()).to.deep.equal(singleClaimCredentialJSON)

    const nameCredential = Credential.create(claimsMetadata.name, multipleClaimsCreationArgs)
    expect(nameCredential.toJSON()).to.deep.equal(multipleClaimsCredentialJSON)
  })
})
