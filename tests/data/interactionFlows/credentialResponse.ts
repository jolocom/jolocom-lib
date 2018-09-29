import { InteractionType } from '../../../ts/interactionFlows/types'
import { defaultContext } from './../../../ts/utils/contexts'
import { testSignedCredentialDefault } from '../credential/signedCredential'

export const credentialResponsePayloadCreationAttrs = {
  typ: InteractionType.CredentialResponse,
  credentialResponse: {
    suppliedCredentials: [testSignedCredentialDefault]
  }
}

export const credentialResponseJSON = {
  suppliedCredentials: [testSignedCredentialDefault]
}

export const credResponsePayloadJSON = {
  credentialResponse: {
    suppliedCredentials: [ testSignedCredentialDefault ] 
  },
  typ: 'credentialResponse',
  iat: 0,
  iss: 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'
}

// where are these used?
export const mockPrivKey = '3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
export const privKeyDID = 'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'

export const signedCredRespJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.\
eyJpc3MiOiJkaWQ6am9sbzo4Zjk3N2U1MGI3ZTVjYmRmZWI1M2EwM2M4MTI5MTNiNzI5NzhjYTM1Yzkz\
NTcxZjg1ZTg2Mjg2MmJhYzhjZGViIiwiaWF0IjowLCJjcmVkZW50aWFsUmVzcG9uc2UiOnsic3VwcGxp\
ZWRDcmVkZW50aWFscyI6W3sidHlwZSI6WyJDcmVkZW50aWFsIiwiTW9ja0NyZWRlbnRpYWwiXSwiY3Jl\
ZGVudGlhbCI6eyJAY29udGV4dCI6WyJodHRwOi8vc2NoZW1hLm9yZy8iXSwiaWQiOiJjbGFpbTppZDp0\
ZXN0IiwiaXNzdWVyIjoiZGlkOmpvbG86aXNzdWVyIiwiY2xhaW0iOnsiaWQiOiJkaWQ6am9sbzpzdWJq\
ZWN0IiwibW9jayI6InZhbHVlIn0sImlzc3VlZCI6IiIsInR5cGUiOlsiQ3JlZGVudGlhbCIsIk1vY2tD\
cmVkZW50aWFsIl0sInByb29mIjp7ImNyZWF0ZWQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJj\
cmVhdG9yIjoiZGlkOmpvbG86aXNzdWVyL2tleXMjMSIsIm5vbmNlIjoiMDAwMDAiLCJzaWduYXR1cmVW\
YWx1ZSI6ImludmFsaWRNb2NrU2lnbmF0dXJlIiwidHlwZSI6Im1vY2tUeXBlIn19fV19fQ.8J4ntVxXv\
JIpt3uGpSkMwUuxWFdLmZH_BVrNbE7KlkCcp65GXE0Q-pG5X2fmgsF2JoXGxogxvrWNykjq4o9joA'
