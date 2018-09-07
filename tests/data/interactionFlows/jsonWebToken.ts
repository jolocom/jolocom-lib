import { InteractionType, IJSONWebTokenCreationAttrs } from '../../../ts/interactionFlows/types';
import { mockPrivKey } from '../credentialResponse/signedCredentialResponse';

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
  signature: 'UqqVNTp7wt26sHRBC0bxs8IyCMWJ0oajBl-i9vVFMFzl3rUEMzo-T9MHEoBnQhbkD7wbfirO6xJzgidZe9S5AA'
}

export const jwtCreateArgs = {
  privateKey: Buffer.from(mockPrivKey, 'hex'),
  payload: {
    iss: 'did:jolo:njkfehruu843iorj3onvgregvefd',
    iat: 0,
    typ: InteractionType.CredentialRequest.toString(),
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
} as IJSONWebTokenCreationAttrs

export const signedCredRequestJWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6am9sbzp\
uamtmZWhydXU4NDNpb3JqM29udmdyZWd2ZWZkIiwiaWF0IjowLCJ0eXAiOiJjcm\
VkZW50aWFsUmVxdWVzdCIsImNyZWRlbnRpYWxSZXF1ZXN0Ijp7ImNyZWRlbnRpY\
WxSZXF1aXJlbWVudHMiOlt7InR5cGUiOlsiQ3JlZGVudGlhbCIsIk1vY2tDcmVk\
ZW50aWFsIl0sImNvbnN0cmFpbnRzIjpbeyI9PSI6W3sidmFyIjoiaXNzdWVyIn0\
sImRpZDpqb2xvOmlzc3VlciJdfV19XSwiY2FsbGJhY2tVUkwiOiJodHRwOi8vdG\
VzdC5jb20ifX0.UqqVNTp7wt26sHRBC0bxs8IyCMWJ0oajBl-i9vVFMFzl3rUEM\
zo-T9MHEoBnQhbkD7wbfirO6xJzgidZe9S5AA'

export const credentialRequestPayloadJson = {
  iss: 'did:jolo:njkfehruu843iorj3onvgregvefd',
  iat: 0,
  typ: InteractionType.CredentialRequest.toString(),
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
