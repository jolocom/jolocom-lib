export const challengeResponse = {
  did: 'did:jolo:test',
  signedChallenge: 'erjflskef'
}

export const jsonAuthResponse = {
  challengeResponse: challengeResponse
}

export const jsonAuthResponsePayload = {
  authResponse: jsonAuthResponse,
  typ: 'authenticationResponse'
}

export const mockJsonAuthResponsePayload = {
  authResponse: jsonAuthResponse,
  typ: 'authenticationResponse',
  iat: 0,
  iss: 'did:jolo:test'
}