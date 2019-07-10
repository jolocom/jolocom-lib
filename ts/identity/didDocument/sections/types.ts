import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/js/types'

export interface IPublicKeySectionAttrs {
  id: string
  type: string
  publicKeyHex: string
}

export interface IAuthenticationSectionAttrs {
  publicKey: string
  type: string
}

export interface IServiceEndpointSectionAttrs {
  id: string
  type: string
  serviceEndpoint: string | PublicProfileClaimMetadata
  description: string
}
