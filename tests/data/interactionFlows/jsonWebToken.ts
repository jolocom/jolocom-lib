import { InteractionType } from '../../../ts/interactionFlows/types';

export const credentialRequestJson = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      type: ['Credential', 'MockCredential'],
      constraints: [{ '==': [
        { var: 'issuer' },
        'did:jolo:issuer'
      ] }]
    }
  ]
}

export const jwtJSON = {
  header: { typ: 'JWT', alg: 'ES256K' },
  payload: {
    iss: 'did:jolo:njkfehruu843iorj3onvgregvefd',
    iat: 0,
    typ: InteractionType.CredentialRequest,
    credentialRequest: credentialRequestJson
  },
  signature: 'SK7pVnsZkqsR_CopE35DJLvUsOgTZlFSEztNDjAAYLDjsvaoD5HrLytDWKBwr7MoUaUjEYV92Gu2br-k6lgV6Q'
}
