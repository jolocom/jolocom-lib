import { firstMockCredential } from '../credentialRequest/credentialRequest'

export const mockSuppliedCredentials = [{
  type: firstMockCredential.type,
  credential: firstMockCredential
}]

// export const signedCredentialResponseCreationArgs = {
//   header: {
//     typ: 'JWT',
//     alg: 'ES256K'
//   },
//   payload: {
//     iat: 1528722749647,
//     iss: 'did:jolo:18ce95727c0f4e73a0a027afe119bd0776f37e605cf237cd6af675739f9f0ffc',
//     credentialResponse: [firstMockCredential]
//   },
//   signature: 'dgR_0UpMcds4AmTw0_01Xj0-'
// }
