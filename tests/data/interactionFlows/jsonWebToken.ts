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
  signature: 'SK7pVnsZkqsR_CopE35DJLvUsOgTZlFSEztNDjAAYLDjsvaoD5HrLytDWKBwr7MoUaUjEYV92Gu2br-k6lgV6Q'
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
'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6am9sbzpuamtmZWhydX\
U4NDNpb3JqM29udmdyZWd2ZWZkIiwiaWF0IjowLCJ0eXAiOiJjcmVkZW50aWFsUmVxdWVzdCIs\
ImNyZWRlbnRpYWxSZXF1ZXN0Ijp7ImNhbGxiYWNrVVJMIjoiaHR0cDovL3Rlc3QuY29tIiwiY3\
JlZGVudGlhbFJlcXVpcmVtZW50cyI6W3sidHlwZSI6WyJDcmVkZW50aWFsIiwiTW9ja0NyZWRl\
bnRpYWwiXSwiY29uc3RyYWludHMiOlt7Ij09IjpbeyJ2YXIiOiJpc3N1ZXIifSwiZGlkOmpvbG\
86aXNzdWVyIl19XX1dfX0.SK7pVnsZkqsR_CopE35DJLvUsOgTZlFSEztNDjAAYLDjsvaoD5Hr\
LytDWKBwr7MoUaUjEYV92Gu2br-k6lgV6Q'
