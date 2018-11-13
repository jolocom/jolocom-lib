```typescript

import { Credential } from "jolocom-lib/credentials/credential/credential"
import { claimsMetadata } from "cred-types-jolocom-core"

const credential = Credential.create({
  metadata: claimsMetadata.emailAddress,
  claim: {
    email: 'test@test.com'
  },
  subject: 'did:jolo:subject'
})
```