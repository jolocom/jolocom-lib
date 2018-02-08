import { expect } from 'chai'
import testSignVerifyData from './data/sign-verify'
import testAuth from './data/authentication'
import Authentication from '../ts/sso/authentication'
import * as QRCode from 'qrcode'
import * as bitcoin from 'bitcoinjs-lib'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'

var authentication = new Authentication()

describe('create and verify json webtokens', () => {
  const did = 'did:jolo:6xExKfgg2WRGBPLJeUhmYk'
  const claims = ['name', 'proofOfAge']
  const IPFSroom = 'fekrnkegr'
  const rawPrivateKey = testAuth.rawPrivateKey
  const rawPublicKey = testAuth.rawPublicKey

  it('should create a valid token', () => {
    const tokenPayload = {
      did: did,
      claims: claims,
      IPFSroom: IPFSroom
    }
    const token = new TokenSigner('ES256k', rawPrivateKey).sign(tokenPayload)
    expect(token).to.equal(testAuth.token)
  })

  it('should correctly decode the token', () => {
    const tokenData = decodeToken(testAuth.token)
    expect(tokenData.payload.did).to.equal(testAuth.tokenData.payload.did)
    expect(tokenData.signature).to.equal(testAuth.tokenData.signature)
  })

  it('should correctly verify the signature', () => {
    const verified = new TokenVerifier('ES256k', rawPublicKey).verify(testAuth.token)
    expect(verified).to.equal(true)
  })
})

describe('get signing keys from WIF', () => {
  it('should derive a valid private and public key from WIF', () => {
    const WIF = testAuth.WIF
    const keyPair = bitcoin.ECPair.fromWIF(WIF)
    const privateKey = keyPair.d.toBuffer(32).toString('hex')
    const publicKey = keyPair.getPublicKeyBuffer().toString('hex')

    expect(privateKey.length).to.equal(64 || 66)
    expect(privateKey).to.be.a('string')
    expect(publicKey).to.be.a('string')
  })
})

describe('authentication process SSO', () => {
  let tokenRequest
  let tokenRequestNoEncryption
  let tokenDataReq
  let initiatorSecret
  let tokenResponse

  it('initiateRequest should return correct data when called with encrypt equals true ', (done) => {
    authentication.initiateRequest({
      did: 'kfjnrej',
      claims: ['name'],
      IPFSroom: 'kfernnwrklgmlemgkm',
      WIF: testAuth.WIF,
      encrypt: true
    })
    .then((res) => {
      tokenRequest = res.token
      initiatorSecret = res.initiator

      expect(res.token).to.be.a('string')
      expect(res.qrCode).to.include('data:image/png;base64')
      expect(res).to.have.property('initiator')
      done()
    })
  }).timeout(11000)

  it('initiateRequest should return correct data when called with encrypt equals false ', (done) => {
    authentication.initiateRequest({
      did: 'kfjnrej',
      claims: ['name'],
      IPFSroom: 'kfernnwrklgmlemgkm',
      WIF: testAuth.WIF,
      encrypt: false
    })
    .then((res) => {
      tokenRequestNoEncryption = res.token
      expect(res.token).to.be.a('string')
      expect(res.qrCode).to.include('data:image/png;base64')
      expect(res).to.not.have.property('initiator')
      done()
    })
  })

  it('authenticateRequest should return token data when token is verified ', () => {
    const res = authentication.authenticateRequest({token: tokenRequest})
    tokenDataReq = res
    expect(res).to.have.property('payload')
  })

  it('authenticateRequest should return an ERROR when token is not verified ', () => {
    const res = authentication.authenticateRequest({token: testAuth.tokenWrong})
    expect(res).to.be.an('error')
  })

  it('initiateResponse should return a token ', (done) => {
    authentication.initiateResponse({
      tokenData: tokenDataReq,
      WIF: testAuth.WIF,
      did: testAuth.mockDIDSUB,
      claims: [{name: 'Natascha'}, {hobby: 'day trading'}]
    }).then((res) => {
        tokenResponse = res
        expect(res).to.be.a('string')
        done()
      })
  })

  it('authenticateResponse should return claims array when token is authenticated (data encrypted)', (done) => {
    authentication.authenticateResponse({token: tokenResponse, secretExchangeParty: initiatorSecret})
      .then((res) => {
        expect(res).to.deep.equal([{name: 'Natascha'}, {hobby: 'day trading'}])
        done()
      })
  }).timeout(10000)

  it('authenticationResponse should return claims array when token is authenticated (data not encrypted)', (done) => {
    const tokenData = authentication.authenticateRequest({token: tokenRequestNoEncryption})

    authentication.initiateResponse({tokenData: tokenData, WIF: testAuth.WIF, did: testAuth.mockDIDSUB, claims: [{name: 'warren'}]})
      .then((res) => {
        return authentication.authenticateResponse({token: res})
      })
      .then((res) => {
        expect(res).to.deep.equal([{name: 'warren'}])
        done()
      })
  })

})
