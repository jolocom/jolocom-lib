import { claimsMetadata } from 'cred-types-jolocom-core'
import { defaultContext } from '../../../ts/utils/contexts'

/* Defining custom metadata objects for custom credentials */

export const mockKeyId =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1'
export const mockIssuerDid =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const mockSubject =
  'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/* Defining fixture for a signedCredential in JSON form */

export const emailVerifiableCredentialHash =
  'b516dc3d9d125efe41dd5bc30b94aa2a9bb8b8676f90dbd8d5d9104d18e6a426'
export const emailVerifiableCredential = {
  '@context': [...defaultContext, ...claimsMetadata.emailAddress.context],
  id: 'claimId:567e6e0c6570a',
  name: 'Email address',
  issuer: mockIssuerDid,
  type: ['Credential', 'ProofOfEmailCredential'],
  claim: { email: 'test@jolocom.io', id: mockSubject },
  issued: '1970-01-01T00:00:00.000Z',
  expires: '1971-01-01T00:00:00.000Z',
  proof: {
    type: 'EcdsaKoblitzSignature2016',
    creator: mockKeyId,
    nonce: '1842fb5f567dd532',
    signatureValue: '',
    created: '1970-01-01T00:00:00.000Z',
  },
}
