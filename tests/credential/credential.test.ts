import { claimsMetadata } from 'cred-types-jolocom-core'
import { expect } from 'chai'
import { Credential } from '../../ts/credentials/credential/credential'
import { EmailClaimMetadata, NameClaimMetadata } from 'cred-types-jolocom-core/js/types'
import { defaultContext } from '../../ts/utils/contexts'
import {
  emailCredentialJSON,
  nameCredentialJSON,
  INestedAddressClaimInterface,
  addressCredentialJSON,
  mockEmailCredCreationAttrs,
  mockNameCredCreationAttrs,
  mockAddrCredCreationAttrs,
  mockBirthdayCredCreationAttrs,
  birthdayCredentialJSON
} from '../data/credential/credential'

describe.only('Credential', () => {
  describe('static create method', () => {
    it('Should correctly instantiate given a single claim credential', () => {
      const credential = Credential.create<EmailClaimMetadata>(mockEmailCredCreationAttrs)
      const credentialFromJSON = Credential.fromJSON(emailCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly instantiate given a credential given multiple claims', () => {
      const credential = Credential.create<NameClaimMetadata>(mockNameCredCreationAttrs)
      const credentialFromJSON = Credential.fromJSON(nameCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('Should correctly assemble a credential given nested, multiline claims', () => {
      const credential = Credential.create<INestedAddressClaimInterface>(mockAddrCredCreationAttrs)
      expect(credential.toJSON()).to.deep.equal(addressCredentialJSON)
    })

    it('Should correctly assemble a custom credential', () => {
      const customCredential = Credential.create(mockBirthdayCredCreationAttrs)
      const customCredentialFromJSON = Credential.fromJSON(birthdayCredentialJSON)
      expect(customCredential).to.deep.equal(customCredentialFromJSON)
    })
  })

  it('Should implement all getter methods', () => {
    const credential = Credential.create<EmailClaimMetadata>(mockEmailCredCreationAttrs)

    expect(credential.getClaim()).to.deep.equal(mockEmailCredCreationAttrs.claim)
    expect(credential.getContext()).to.deep.equal([...defaultContext, ...claimsMetadata.emailAddress.context])
    expect(credential.getName()).to.deep.equal(claimsMetadata.emailAddress.name)
    expect(credential.getType()).to.deep.equal(claimsMetadata.emailAddress.type)
  })

  it('Should implement static fromJSON method', () => {
    const credential = Credential.create<EmailClaimMetadata>(mockEmailCredCreationAttrs)
    const credFromJson = Credential.fromJSON(emailCredentialJSON)
    expect(credential).to.deep.equal(credFromJson)

    const nameCredential = Credential.create<NameClaimMetadata>(mockNameCredCreationAttrs)
    const nameCredentialFromJSON = Credential.fromJSON(nameCredentialJSON)
    expect(nameCredential).to.deep.equal(nameCredentialFromJSON)
  })

  it('Should implement toJSON method', () => {
    const credential = Credential.create<EmailClaimMetadata>(mockEmailCredCreationAttrs)

    expect(credential.toJSON()).to.deep.equal(emailCredentialJSON)
    const nameCredential = Credential.create<NameClaimMetadata>(mockNameCredCreationAttrs)
    expect(nameCredential.toJSON()).to.deep.equal(nameCredentialJSON)
  })
})
