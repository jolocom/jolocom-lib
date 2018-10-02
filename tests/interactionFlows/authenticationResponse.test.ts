import { expect } from 'chai'
import { AuthenticationResponse } from '../../ts/interactionFlows/authenticationResponse/authenticationResponse'
import { jsonAuthResponse } from '../data/interactionFlows/authenticationResponse'
import { testPrivateIdentityKey } from '../data/keys'
import { jsonAuthRequest } from '../data/interactionFlows/authenticationRequest'
import { privateKeyToDID, privateKeyToPublicKey } from '../../ts/utils/crypto';

describe('AuthenticationResponse', () => {
  const did = privateKeyToDID(Buffer.from(testPrivateIdentityKey))
  const pubKey = privateKeyToPublicKey(Buffer.from(testPrivateIdentityKey))
  const authenticationResponse = AuthenticationResponse.create({
    challenge: jsonAuthRequest.challenge,
    did,
    keyId: `${did}#keys-1`,
    privKey: testPrivateIdentityKey
  })

  it('Should create instace of AuthenticationResponse on static create', () => {
    expect(authenticationResponse).to.be.instanceOf(AuthenticationResponse)
    expect(authenticationResponse).to.deep.equal(AuthenticationResponse.fromJSON(jsonAuthResponse))
  })

  it('Should expose class specific methods on authenticationResponse', async () => {
    expect(authenticationResponse.validateSignatureWithPublicKey).to.exist
    expect(authenticationResponse.getSigner).to.exist
    expect(authenticationResponse.generateSignature).to.exist
  })

  it('Should correctly validate signature of challenge on validateSignatureWithPublicKey', async () => {
    expect(await authenticationResponse.validateSignatureWithPublicKey(pubKey)).to.be.true
  })

  it('Should implement toJSON method', () => {
    expect(authenticationResponse.toJSON()).to.deep.equal(jsonAuthResponse)
  })

  it('Should implement static fromJSON method', () => {
    const authResponse = AuthenticationResponse.fromJSON(jsonAuthResponse)
    
    expect(authResponse).to.be.instanceOf(AuthenticationResponse)
    expect(authResponse).to.deep.equal(authenticationResponse)
  })
})