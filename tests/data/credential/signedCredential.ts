import { singleClaimCreationArgs } from './credential'
import { testPrivateIdentityKey } from '../keys'
import { claimsMetadata } from 'cred-types-jolocom-core'

export const testSignedCredentialCreateArgs = {
  metadata: claimsMetadata.emailAddress,
  claim: singleClaimCreationArgs,
  privateIdentityKey: {
    key: testPrivateIdentityKey,
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1'
  },
  subject: 'did:jolo:test'
}
