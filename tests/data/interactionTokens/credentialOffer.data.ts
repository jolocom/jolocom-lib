import {CredentialOfferRequestCreationArgs, CredentialOfferResponseCreationArgs} from '../../../ts/identityWallet/types'
import { claimsMetadata } from 'cred-types-jolocom-core'

const callbackURL = 'https://test.de/external-cred'
export const credentialOfferRequestCreationArgs: CredentialOfferRequestCreationArgs = {
  callbackURL,
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
export const credentialOfferResponseCreationArgs: CredentialOfferResponseCreationArgs = {
  callbackURL,
  selectedCredentials: [{
    type: claimsMetadata.emailAddress.type[1],
  }]
}
