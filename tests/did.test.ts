import { expect } from 'chai'
import Did from '../ts/identity/did'
import testData from './data/identity'

describe('DID', () => {

    const publicKey = Buffer.from(testData.testUserPublicKey, 'utf8')
    const did = new Did(publicKey)

  it('Should correctly instantiate a DID class from user public key', () => {
    const result = testData.testUserDID
    expect(did.identifier).to.be.a('string')
    expect(did.identifier).to.equal(result)
  })

  it('Should contain a method which takes the relevant verifiable credential as an input and returns a secp256k1 ECDSA signature', () => {
    const result = did._createSignature(credential)
		//expect(result).to.equal.(expectedVerifiedCredential.proof
  })

  it('Should contain a method which correctly generates and returns a verifiable credential' , () => {
    const id = "http://example.gov/credentials/3732"
    const credentialType = '["Credential"]'
    const claim = {}
    const result = did.createVerifiableCredential(id, credentialType, claim)
    //console.log(result)
    //expect(result).to.equal.(expectedVerifiedCredential)
  })

  it('Should contain a method which adds a verified credential to IPFS and returns the IPFS hash', () => {
		const result = did.storeVerifiedCredential(verifiedCredential)
		//expects calls to IPFS storage agent
  })
})
