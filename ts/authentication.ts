import * as superagent from 'superagent-es6-promise'
import TokenPayload from './tokenPayload'
import testAuth from '../tests/data/authentication'
import { signMessage, verifySignedMessage } from './sign-verify'
import * as QRCode from 'qrcode'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import * as bitcoin from 'bitcoinjs-lib'

export async function createQRCode(did : String, claims : Array<any>, IPFSroom : String) : Promise<any> {

  const keys = _getSigningKeysFromWIF()
  const tokenPayload = new TokenPayload({
    iss: 'did:jolo:6xExKfgg2WRGBPLJeUhmYk',
    reqClaims: [ 'name', 'proofOfAge' ],
    IPFSroom: 'fekrnkegr',
    pubKeyIss: keys.pubKey
  })
  const token = new TokenSigner('ES256k', keys.privKey).sign(tokenPayload)

  QRCode.toDataURL(token, (err, url) => {
    if(err) {
      return err
    }
    return url
  })
}

// createQRCode(testAuth.mockDIDISS, [ 'name', 'proofOfAge' ], 'kernjreng')


export async function authenticateRequest(token : String) {
  const tokenData = decodeToken(token)
  const verify = new TokenVerifier('ES256k', tokenData.payload.pubKeyIss).verify(token)

  if(verify) {
    /* TODO: get claims for requested fields for private claims
    get did for public claims; 2nd step: check one verification from requester
    */

    // const keys = _getSigningKeysFromWIF()

    const tokenPayload = TokenPayload.generateResponse({
      tokenData: tokenData,
      sub: testAuth.mockDIDSUB,
      pubKeySub: testAuth.rawPublicKey,
      claims: {name: 'Natascha'}
    })

    const token = new TokenSigner('ES256K', testAuth.rawPrivateKey).sign(tokenPayload)

    // TODO: post to IPFS random room here

    return 'OK'
  } else {
    return new Error('Web Token Not Valid')
  }
}



export async function authenticateResponse(token : String) {
  const tokenData = decodeToken(token)
  const verify = new TokenVerifier('ES256k', tokenData.payload.pubKeySub).verify(token)
  if(verify) {
    /*TODO: resolve did to ddo; resolve claims in service endpoints section and check respective issuer
    */
    const mockDDO = testAuth.ddo
    return 'OK'
  } else {
    return new Error('Web Token Not Valid')
  }
}

// authenticateRequest(testAuth.mockTokenReq)
// authenticateResponse(testAuth.mockTokenRes)

function _getSigningKeysFromWIF() {
  const WIF = 'L1Xs8xNygctCDgry2UsYCPywgC1WUckEePZ9NGdZswTzhjoAooNu'
  const keyPair = bitcoin.ECPair.fromWIF(WIF)

  let keys = {
    pubKey: keyPair.getPublicKeyBuffer().toString('hex'),
    privKey: keyPair.d.toBuffer(32).toString('hex')
  }

  return keys
}
