import { InteractionType } from '../../../ts/interactionFlows/types';

export const credentialRequestJson = {
  callbackURL: 'http://test.com',
  credentialRequirements: [
    {
      constraints: {
        and: [{ '==': [true, true] }, { '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
      },
      type: ['Credential', 'MockCredential']
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
  signature: 'hUO5JAoa3neodPqX3aF29qV8fBrtmtZO_EtxMw2ATsjUn53B-V_TC-bRsX0kqy2LVw5uHKmriH9_C08EsRMhFQ'
}
