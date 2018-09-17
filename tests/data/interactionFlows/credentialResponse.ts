import { firstMockCredential } from './mockCredentials';
import { InteractionType } from '../../../ts/interactionFlows/types'

export const credentialResponsePayloadJson = {
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  iat: 0,
  typ: InteractionType.CredentialResponse,
  credentialResponse: {
    suppliedCredentials: {
      type: firstMockCredential.type,
      credential: firstMockCredential
    }
  }
}
