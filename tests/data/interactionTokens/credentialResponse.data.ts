import { credentialSet } from './credentialRequest.data'

export const credentialResponseJSON = {
  callbackURL: 'https://test.io/auth/abc',
  suppliedCredentials: credentialSet,
}

export const emptyCredentialResponseJSON = {
  callbackURL: 'https://test.io/auth/abc',
  suppliedCredentials: []
}