```typescript

import { SignedCredential } from './credentials/signedCredential/signedCredential'
import { claimsMetadata } from 'cred-types-jolocom-core'

const signedCred = await SignedCredential.create({
  metadata: claimsMetadata.emailAddress,
  claim: {
    email: 'test@test.com',
  },
  subject: 'did:jolo:...'
}, {
  issuerDid: 'did:jolo:...',
  keyId: 'did:jolo:...#keys-1'
})
```