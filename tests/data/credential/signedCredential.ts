import { claimsMetadata } from '../../../ts'
import { singleClaimCreationArgs } from './credential'
import { testPrivateIdentityKey } from '../keys'

export const testSignedCredentialCreateArgs = {
  credentialAttrs: {
    metadata: claimsMetadata.emailAddress,
    claim: singleClaimCreationArgs
  },
  privateIdentityKey: {
    key: testPrivateIdentityKey,
    id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1'
  }
}
