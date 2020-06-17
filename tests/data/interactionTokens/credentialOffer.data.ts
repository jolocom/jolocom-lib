import { claimsMetadata } from 'jolocom-protocol-ts'
const callbackURL = 'https://test.de/external-cred'

export const credentialOfferRequestCreationArgs = {
  callbackURL,
  offeredCredentials: [
    {
      type: claimsMetadata.emailAddress.type[1],
      renderInfo: {
        background: {
          color: '#ffffff',
        },
      },
      requestedInput: {},
      metadata: {
        asynchronous: false,
      },
    },
  ],
}
export const credentialOfferResponseCreationArgs = {
  callbackURL,
  selectedCredentials: [
    {
      type: claimsMetadata.emailAddress.type[1],
    },
  ],
}
