import { expect } from 'chai'
import testSignVerifyData from './data/sign-verify'
import testAuth from './data/authentication'
import * as QRCode from 'qrcode'
import * as bitcoin from 'bitcoinjs-lib'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'

describe('create QR Code', () => {
  it('should create a valid QRCode for authenticaton process', () => {
    const did = 'did:jolo:6xExKfgg2WRGBPLJeUhmYk'
    const claims = ['name', 'proofOfAge']
    const IPFSroom = 'fekrnkegr'
    const rawPrivateKey = testAuth.rawPrivateKey


    const token = new TokenSigner('ES256k', rawPrivateKey).sign({
      did: did,
      claims: claims,
      IPFSroom: IPFSroom
    })

    QRCode.toDataURL(token)
    .then((url) => {
      expect(url).to.be.a('string')
      expect(url).to.include('data:image/png;base64')
    })
    .catch((err) => {
      console.log('ERROR: ', err)
    })
  })
})

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
