import * as superagent from 'superagent-es6-promise'
import TokenPayload from './tokenPayload'
import testAuth from '../tests/data/authentication'
import { signMessage, verifySignedMessage } from './sign-verify'
import * as QRCode from 'qrcode'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import * as bitcoin from 'bitcoinjs-lib'

export async function createQRCode({did, claims, IPFSroom, WIF} :
  {did : string, claims : Array<string>, IPFSroom : string, WIF : string}) : Promise<any> {

  const keys = _getSigningKeysFromWIF({WIF: WIF})
  const tokenPayload = new TokenPayload({
    iss: did,
    reqClaims: claims,
    IPFSroom: IPFSroom,
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

export async function authenticateRequest({token, WIF} :
  {token : string, WIF : string}) {
  const tokenData = decodeToken(token)
  const verify = new TokenVerifier('ES256k', tokenData.payload.pubKeyIss).verify(token)

  if(verify) {
    /* TODO:
      1. get did for user persona with public claims to add it to communication
      2. resolve did iss to ddo of requester
      3. form ddo, get one claim hash and resolve to claim information
    */

    const did = _getDID()
    const keys = _getSigningKeysFromWIF({WIF: WIF})

    const tokenPayload = TokenPayload.generateResponse({
      tokenData: tokenData,
      sub: did, // mock
      pubKeySub: keys.pubKey,
      claims: {name: 'Natascha'} // mock
    })

    const token = new TokenSigner('ES256K', testAuth.rawPrivateKey).sign(tokenPayload)

    // TODO: post token to IPFS random room

    return 'OK'
  } else {
    return new Error('Web Token Not Valid')
  }
}



export async function authenticateResponse({token} : {token : string}) {
  const tokenData = decodeToken(token)
  const verify = new TokenVerifier('ES256k', tokenData.payload.pubKeySub).verify(token)
  if(verify) {
    /*TODO:
      1. resolve did sub to ddo
      2. resolve claims in service endpoints section and check respective issuer
      3. some interaction should happen here on trusting the issuer of verification from claim
    */
    const mockDDO = testAuth.ddo

    // TODO: post token to IPFS random room here
    return 'OK'
  } else {
    return new Error('Web Token Not Valid')
  }
}

function _getSigningKeysFromWIF({WIF} : {WIF : string}) {
  const keyPair = bitcoin.ECPair.fromWIF(WIF)

  let keys = {
    pubKey: keyPair.getPublicKeyBuffer().toString('hex'),
    privKey: keyPair.d.toBuffer(32).toString('hex')
  }

  return keys
}

function _getDID() {
  return 'did:jolo:f3ern3prgkpernn' // mock
}
