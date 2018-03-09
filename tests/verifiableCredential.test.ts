import { expect } from 'chai'
import VerifiableCredential from '../ts/claims/verifiableCredential'
import Did from '../ts/identity/did'
import testDataIdentity from './data/identity'
import testDataKeys from './data/keys'
import * as lolex from 'lolex'
import * as sinon from 'sinon'
import * as bitcoin from 'bitcoinjs-lib'
import * as moment from 'moment'

describe('VerifiableCredential', () => {
  const did = new Did(testDataIdentity.testUserPublicKey)
  const unixEpoch = moment.utc('2018-01-24T15:42:15Z', moment.ISO_8601).valueOf()
  const clock = lolex.install({now: unixEpoch})
  sinon.stub(VerifiableCredential.prototype, 'generateVerifiableCredentialID').returns('11111')

  it('Should correctly instantiate a Verifiable Credential', () => {
    const credentialType = ['Credential']
    const issuerID ='did:jolo:0x0aecaae09eb4b6433a4136fbac29a5ea93dd3593dd120e16a314744d3945d119'
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver:21}
    const vc = new VerifiableCredential({
      credentialType,
      issuer: issuerID,
      claim
    })
    expect(JSON.stringify(vc)).to.equal(JSON.stringify(testDataIdentity.expectedVerifiedCredential))
  })

  it('#create correctly generates and returns a signed verifiable credential' , () => {
    const credentialType = ['Credential']
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver: 21}
    const result = VerifiableCredential.createVerified({
      issuer: did.identifier,
      credentialType,
      claim,
      privateKeyWIF: testDataKeys.testGenericKeyPairWIF
    })
    expect(JSON.stringify(result)).to.equal(JSON.stringify(testDataIdentity.expectedSignedCredential))
  })

  it('Should contain a method which can verify a signed credential', () => {
    const genericKeyPair = bitcoin.ECPair.fromWIF(testDataKeys.testGenericKeyPairWIF)
    const genericPublicKey = genericKeyPair.getPublicKeyBuffer()

    const credentialType = ['Credential']
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver:21}
    const signed = VerifiableCredential.createVerified({
      issuer: did.identifier,
      credentialType,
      claim,
      expires: '2018-10-24T15:42:15Z',
      privateKeyWIF: testDataKeys.testGenericKeyPairWIF
    })
    const result = signed.credential.verifySignedCredential({
      signature: signed.signature,
      publicKeyOfIssuer: genericPublicKey
    })
    expect(result).to.equal(true)
  })


  it('#create throws an error in case of invalid expiry date' , () => {
    const credentialType = ['Credential']
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver: 21}
    const expires = moment.utc().format()

    expect(VerifiableCredential.createVerified.bind(VerifiableCredential, {
      issuer: did.identifier,
      credentialType,
      claim,
      privateKeyWIF: testDataKeys.testGenericKeyPairWIF,
      expires: expires
    })).to.throw('The provided expiry date of 2018-01-24T15:42:15Z is not valid or the format you pass in is not compliant to ISO_8601.')
  })

  it('#create correctly generates and returns a signed verifiable credential with an expiry date' , () => {
    const credentialType = ['Credential']
    const claim ={id:'did:jolo:0xd0ae58da9f72c48767b04f339a1a0142bb8e86b521d008ca65f7e3983b03d32b', ageOver: 21}
    const expires = moment.utc('2018-10-24T15:42:15Z', moment.ISO_8601).format()
    const result = VerifiableCredential.createVerified({
      issuer: did.identifier,
      credentialType,
      claim,
      privateKeyWIF: testDataKeys.testGenericKeyPairWIF,
      expires: expires
    })
    expect(JSON.stringify(result)).to.equal(JSON.stringify(testDataIdentity.expectedSignedCredentialWithExpiry))
  })
})
