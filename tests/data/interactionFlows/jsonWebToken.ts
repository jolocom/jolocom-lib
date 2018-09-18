import { InteractionType, IJSONWebTokenCreationAttrs } from '../../../ts/interactionFlows/types'
import { mockPrivKey } from '../credentialResponse/signedCredentialResponse'
import { credentialReceiveJson } from './credentialReceive'
import { SignedCredential } from '../../../ts/credentials/signedCredential/signedCredential'
import { signedCredJSON } from './credentialReceive'
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
  privateKey: Buffer.from(mockPrivKey, 'hex'),
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

export const jwtCredentialReceiveArgs = {
  privateKey: Buffer.from(mockPrivKey, 'hex'),
  payload: {
    typ: InteractionType.CredentialsReceive,
    credentialReceive: {
      signedCredentials: [SignedCredential.fromJSON(signedCredJSON)]
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

export const credentialReceivePayloadJson = {
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
  iat: 0,
  typ: InteractionType.CredentialsReceive,
  credentialReceive: {
    signedCredentials: [{
      '@context': [
        "https://w3id.org/identity/v1",
        "https://identity.jolocom.com/terms",
        "https://w3id.org/security/v1",
        "https://w3id.org/credentials/v1",
        "http://schema.org"
      ],
      id: 'claimId:fbd5d7f1efd71',
      name: 'Email address',
      issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
      type: ["Credential","ProofOfEmailCredential"],
      claim: {
        "id": "did:jolo:test",
        "email": "eugeniu@jolocom.com"
      },
      issued: "1970-01-01T00:00:00.000Z",
      expires: undefined,
      proof: {
        "type": "EcdsaKoblitzSignature2016",
        "created": "1970-01-01T00:00:00.000Z",
        "creator": "did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1",
        "nonce": "ebe7c80764745",
        "signatureValue": "vs8bCOmnnpTT4mw3j2cQ7yfZa1IjFNNGGiMIGiSNWuNj8MZdV043xyBwgWozSZLisW4/Vi0zABoq++htD6qMnA=="
      }
    }]
  }
}
