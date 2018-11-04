import { emailVerifiableCredential, mockIssuerDid, mockKeyId } from "../credential/signedCredential.data"

/* Used to test if matching against issuer works */

const invalidIssuer = 'did:jolo:16661'
const tweakedEmailVerifiableCredential = { ...emailVerifiableCredential, issuer: invalidIssuer }
export const credentialSet = [tweakedEmailVerifiableCredential, emailVerifiableCredential]

/* Defining JSON fixtures for testing fromJSON, toJSON methods */

export const simpleCredRequestJSON = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'ProofOfEmailCredential'],
      constraints: [{ '==': [{ var: 'issuer' }, mockIssuerDid] }]
    }
  ]
}

/* Fixture to test if validating against an empty constraint set returns true */

export const emptyConstraintsRequestJSON = {
  ...simpleCredRequestJSON,
  credentialRequirements: [
    {
      type: ['Credential', 'ProofOfEmailCredential'],
      constraints: []
    }
  ]
}

/* Request with two credential requirements, for fromJSON, toJSON, getRequestedTypes tests */

export const extendedCredRequestJSON = {
  ...simpleCredRequestJSON,
  credentialRequirements: [
    simpleCredRequestJSON.credentialRequirements[0],
    {
      type: ['Credential', 'ProofOfPassportCredential'],
      constraints: []
    }
  ]
}

/* Expected outputs of constraint creation functions */

export const expectedIsOutput = {
  '==': [{ var: 'claim.id' }, mockKeyId]
}

export const expectedNotOutput = {
  '!=': [{ var: 'claim.id' }, mockKeyId]
}

export const expectedGreaterOutput = {
  '>': [{ var: 'issued' }, new Date(0)]
}

export const expectedSmallerOutput = {
  '<': [{ var: 'issued' }, new Date(100)]
}
