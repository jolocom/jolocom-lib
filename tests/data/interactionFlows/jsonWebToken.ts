import { credentialRequestJson, mockPrivKey } from './credentialRequest';
import { InteractionType, IJSONWebTokenCreationAttrs } from '../../../ts/interactionFlows/types'

export const jwtJSON = {
  header: { typ: 'JWT', alg: 'ES256K' },
  payload: {
    iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb',
    iat: 0,
    typ: InteractionType.CredentialRequest,
    credentialRequest: credentialRequestJson
  },
  signature: 'VhUfwXkQ4Nxh02qdy7N9n1m4HfVnE0tgCrMwrRrEWNuOwzfnjfD9Xyi06xOkUGKHcoLGYUnWDIPos0fI8ufXOQ'
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
          constraints: [
            { '==': [{ var: 'issuer' }, 'did:jolo:issuer']}
          ]
        }
      ]
    }
  }
} as IJSONWebTokenCreationAttrs

export const signedCredRequestJWT =
// tslint:disable-next-line
'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJNb2NrQ3JlZGVudGlhbCJdLCJjb25zdHJhaW50cyI6eyJhbmQiOlt7Ij09IjpbdHJ1ZSx0cnVlXX0seyI9PSI6W3sidmFyIjoiaXNzdWVyIn0sImRpZDpqb2xvOmlzc3VlciJdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL3Rlc3QuY29tIn0sInR5cCI6ImNyZWRlbnRpYWxSZXF1ZXN0IiwiaWF0IjowLCJpc3MiOiJkaWQ6am9sbzo4Zjk3N2U1MGI3ZTVjYmRmZWI1M2EwM2M4MTI5MTNiNzI5NzhjYTM1YzkzNTcxZjg1ZTg2Mjg2MmJhYzhjZGViIn0.VhUfwXkQ4Nxh02qdy7N9n1m4HfVnE0tgCrMwrRrEWNuOwzfnjfD9Xyi06xOkUGKHcoLGYUnWDIPos0fI8ufXOQ'
