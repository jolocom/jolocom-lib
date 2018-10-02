export const jsonAuthResponse = {
  challengeResponse: {
    challenge: 'erhbgiö3jrewlprg',
    did: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    keyId: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    signatureValue: 'TBh3BMaE+OzXLO5q/LQN94qa5Ko0WjP+hUae+2OoMZ8rdSXaWiEvOeMIERD8gLjyGurVeWQyX7Bupr5B+wP+/g=='
  }
}

export const jsonAuthResponsePayload = {
  iat: 0,
  iss: 'did:jolo:test',
  typ: 'authenticationResponse',
  authResponse: jsonAuthResponse
}