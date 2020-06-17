import { claimsMetadata } from 'jolocom-protocol-ts'
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
  '7d659e5e3088453ba7e668297efdd985e74a49cebd3ce1f9951a09ee74530011'
export const emailVerifiableCredential = {
  '@context': [...defaultContext, ...claimsMetadata.emailAddress.context],
  id: 'claimId:1842fb5f567dd532',
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
