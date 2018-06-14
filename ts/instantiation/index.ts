import { CredentialRequest } from '../credentialRequest';

export const instanate = {
  credentialRequest: {
    fromJSON: CredentialRequest.fromJSON
  },
  credentialResponse: {
    fromJSON: () => {}
  },
  credential: {
    fromJSON: () => {}
  },
  signedCredentialRequest: {
    fromJSON: () => {},
    fromJWT: () => {}
  },
  signedCredentialResponse: {
    fromJSON: () => {},
    fromJWT: () => {}
  },
  signedCredential: {
    fromJSON: () => {}
  }
}
