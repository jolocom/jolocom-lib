import { InteractionType } from '../../../ts/interactionFlows/types'

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

export const credentialRequestPayloadJson = {
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  iat: 0,
  typ: InteractionType.CredentialRequest,
  credentialRequest: {
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
}
