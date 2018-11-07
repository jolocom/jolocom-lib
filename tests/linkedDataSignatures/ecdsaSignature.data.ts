import { mockKeyId } from '../data/credential/signedCredential.data'

export const signatureAttributes = {
  type: 'EcdsaKoblitzSignature2016',
  creator: mockKeyId,
  nonce: '1842fb5f567dd532',
  signatureValue: 'abcdef',
  created: '1970-01-01T00:00:00.000Z'
}

export const incompleteSignatureAttrs = {
  created: '1970-01-01T00:00:00.000Z',
  creator: '',
  nonce: '',
  signatureValue: '',
  type: 'EcdsaKoblitzSignature2016'
}

export const normalizedSignatureSection = '_:c14n0 <http://purl.org/dc/terms/created> "1970-01-01T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\
_:c14n0 <http://purl.org/dc/terms/creator> <did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1> .\
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#EcdsaKoblitzSignature2016> .\
_:c14n0 <https://w3id.org/security#nonce> "1842fb5f567dd532" .'

export const digestedSignatureSection = '4003db2a988b491d6d79c4409b6146186d377b3f535ac98eb8171f51ab8aec8c'