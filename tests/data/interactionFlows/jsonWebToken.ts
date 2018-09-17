import { InteractionType, IJSONWebTokenCreationAttrs } from '../../../ts/interactionFlows/types'
import { mockPrivKey } from '../credentialResponse/signedCredentialResponse'

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
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    iat: 0,
    typ: InteractionType.CredentialRequest,
    credentialRequest: credentialRequestJson
  },
  signature: 'LyZytGL7Ixf3ulHIoHRJqQPjXqrqTKC462NRt4P6m_pyo5ROrjzrqJVSvAqhY6aHucAi2p9j16kuZKj79HUUHA'
}

export const jwtCreateArgs = {
  privateKey: {
    key: Buffer.from(mockPrivKey, 'hex'),
    id: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'
  },
  payload: {
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
} as IJSONWebTokenCreationAttrs

export const signedCredRequestJWT =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJ0eXAiOiJjcmVkZW50aWF\
sUmVxdWVzdCIsImNyZWRlbnRpYWxSZXF1ZXN0Ijp7ImNyZWRlbnRpYWxSZXF1aX\
JlbWVudHMiOlt7InR5cGUiOlsiQ3JlZGVudGlhbCIsIk1vY2tDcmVkZW50aWFsI\
l0sImNvbnN0cmFpbnRzIjpbeyI9PSI6W3sidmFyIjoiaXNzdWVyIn0sImRpZDpq\
b2xvOmlzc3VlciJdfV19XSwiY2FsbGJhY2tVUkwiOiJodHRwOi8vdGVzdC5jb20\
ifSwiaWF0IjowLCJpc3MiOiJkaWQ6am9sbzo4Zjk3N2U1MGI3ZTVjYmRmZWI1M2\
EwM2M4MTI5MTNiNzI5NzhjYTM1YzkzNTcxZjg1ZTg2Mjg2MmJhYzhjZGViIn0.L\
yZytGL7Ixf3ulHIoHRJqQPjXqrqTKC462NRt4P6m_pyo5ROrjzrqJVSvAqhY6aH\
ucAi2p9j16kuZKj79HUUHA'

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
