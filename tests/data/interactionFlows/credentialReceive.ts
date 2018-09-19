export const jsonCredReceivePayload = {
  typ: 'credentialsReceive',
  credentialReceive: { 
    signedCredentials: [
      { '@context': 
   [ 'https://w3id.org/identity/v1',
     'https://identity.jolocom.com/terms',
     'https://w3id.org/security/v1',
     'https://w3id.org/credentials/v1',
     'http://schema.org' ],
    id: 'claimId:9dc39ffb9c78f',
    name: 'Email address',
    issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
    type: [ 'Credential', 'ProofOfEmailCredential' ],
    claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
    issued: new Date('1970-01-01T00:00:00.000Z'),
    expires: undefined,
    proof: 
    { type: 'EcdsaKoblitzSignature2016',
      created: new Date('1970-01-01T00:00:00.000Z'),
      creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
      nonce: 'ae3b07329969',
      signatureValue: 'iHxfRLbRJmreC5IjgGmWARGPje0biG045T9HXN0ImzsEU35rJKci5FvH8/cCeDEBjBe7Bfw3LanL+3SzBcb/Rg==' } }
      ] 
  } 
}

export const jsonCredReceive = {
  signedCredentials: [
    { '@context': 
 [ 'https://w3id.org/identity/v1',
   'https://identity.jolocom.com/terms',
   'https://w3id.org/security/v1',
   'https://w3id.org/credentials/v1',
   'http://schema.org' ],
  id: 'claimId:9dc39ffb9c78f',
  name: 'Email address',
  issuer: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
  type: [ 'Credential', 'ProofOfEmailCredential' ],
  claim: { id: 'did:jolo:test', email: 'eugeniu@jolocom.com' },
  issued: new Date('1970-01-01T00:00:00.000Z'),
  expires: undefined,
  proof: 
  { type: 'EcdsaKoblitzSignature2016',
    created: new Date('1970-01-01T00:00:00.000Z'),
    creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#keys-1',
    nonce: 'ae3b07329969',
    signatureValue: 'iHxfRLbRJmreC5IjgGmWARGPje0biG045T9HXN0ImzsEU35rJKci5FvH8/cCeDEBjBe7Bfw3LanL+3SzBcb/Rg==' } }
    ]
}