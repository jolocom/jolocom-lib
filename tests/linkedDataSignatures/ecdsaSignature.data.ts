import { mockKeyId } from '../data/credential/signedCredential.data'

export const signatureAttributes = {
  type: 'EcdsaKoblitzSignature2016',
  creator: mockKeyId,
  nonce: '1842fb5f567dd532',
  signatureValue: 'abcdef',
  created: '1970-01-01T00:00:00.000Z',
}

export const incompleteSignatureAttrs = {
  created: '1970-01-01T00:00:00.000Z',
  creator: '',
  nonce: '',
  signatureValue: '',
  type: 'EcdsaKoblitzSignature2016',
}

export const normalizedSignatureSection =
  '_:c14n0 <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n_:c14n0 <http://purl.org/dc/terms/creator> <did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1> .\n_:c14n0 <https://w3id.org/security#nonce> "1842fb5f567dd532" .\n'
