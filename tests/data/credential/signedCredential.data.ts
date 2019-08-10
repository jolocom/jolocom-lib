import { claimsMetadata } from 'cred-types-jolocom-core'
import { signedCredentialContext } from '../../../ts/utils/contexts'

/* Defining custom metadata objects for custom credentials */

export const mockKeyId =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1'
export const mockIssuerDid =
  'did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const mockSubject =
  'did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/* Defining fixture for a signedCredential in JSON form */

export const emailVerifiableCredentialHash =
  'fc84e790dc09483c6a223b6cc9bc6fe910cff3d9a91aff7acbf0d1f31d9e5984'

export const emailVerifiableCredential = {
  '@context': [
    ...signedCredentialContext,
    ...claimsMetadata.emailAddress.context,
  ],
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

export const normalizedEmailVerifiableCredential =
  `<claimId:1842fb5f567dd532> <http://schema.org/name> "Email address" .
<claimId:1842fb5f567dd532> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://identity.jolocom.com/terms/ProofOfEmailCredential> .
<claimId:1842fb5f567dd532> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/credentials#Credential> .
<claimId:1842fb5f567dd532> <https://w3id.org/credentials#claim> <did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff> .
<claimId:1842fb5f567dd532> <https://w3id.org/credentials#issued> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<claimId:1842fb5f567dd532> <https://w3id.org/credentials#issuer> <did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa> .
<claimId:1842fb5f567dd532> <https://w3id.org/security#expiration> "1971-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<claimId:1842fb5f567dd532> <https://w3id.org/security#proof> _:c14n0 .
<did:jolo:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff> <http://schema.org/email> "test@jolocom.io" .
_:c14n0 <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
_:c14n0 <http://purl.org/dc/terms/creator> <did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1> .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#EcdsaKoblitzSignature2016> .
_:c14n0 <https://w3id.org/security#nonce> "1842fb5f567dd532" .
_:c14n0 <https://w3id.org/security#signatureValue> "" .\n`
