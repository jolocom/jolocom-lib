import { CredentialOfferRequestCreationArgs } from '../../../ts/identityWallet/types'
import { claimsMetadata } from 'cred-types-jolocom-core'

export const credentialOfferCreateAttrs: CredentialOfferRequestCreationArgs = {
  callbackURL: 'https://test.de/external-cred',
  offeredCredentials: [
    {
      type: claimsMetadata.emailAddress.type[1],
      renderInfo: {
        background: {
          color: '#ffffff',
        },
      },
      metadata: {
        asynchronous: false,
      },
    },
  ],
}
