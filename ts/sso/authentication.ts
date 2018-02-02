import * as superagent from 'superagent-es6-promise'
import TokenPayload from './tokenPayload'
import testAuth from '../../tests/data/authentication'
import * as QRCode from 'qrcode'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import * as bitcoin from 'bitcoinjs-lib'
import {
  initiateSecretExchange,
  respondSecretExchange,
  getEncryptionSecret,
  encrypt,
  decrypt
} from '../security/encryption'

let initiatorParty

export async function createQRCode({did, claims, IPFSroom, WIF, encrypt} :
  {did : string, claims : Array<string>, IPFSroom : string, WIF : string, encrypt: boolean}) : Promise<any> {

  let encryptOptions
  if(encrypt) {
    console.log('encrypt true')
    encryptOptions = initiateSecretExchange() // the initiator object MUST be stored by service
    initiatorParty = encryptOptions.initiator // mock storage of initiator
  }
  const keys = _getSigningKeysFromWIF({WIF: WIF})
  const tokenPayload = new TokenPayload({
    iss: did,
    pubKeyIss: keys.pubKey,
    encryptPrime: encrypt ? encryptOptions.prime : '',
    encryptPubKeyIss: encrypt ? encryptOptions.initiatorKey : '',
    reqClaims: claims,
    IPFSroom: IPFSroom
  })
  const token = new TokenSigner('ES256k', keys.privKey).sign(tokenPayload)

  authenticateRequest({token: token, WIF: testAuth.WIF}) // for test only

  QRCode.toDataURL(token, (err, url) => {
    if(err) { return err }
    return url
  })
}


createQRCode({
  did: 'kfjnrej',
  claims: ['name'],
  IPFSroom: 'kfernnwrklgmlemgkm',
  WIF: testAuth.WIF,
  encrypt: true
})


export async function authenticateRequest({token, WIF} :
  {token : string, WIF : string}) {
  const tokenData = decodeToken(token)
  const isTokenVerified = new TokenVerifier('ES256k', tokenData.payload.pubKeyIss).verify(token)
  const isDataEncrypted = tokenData.payload.encryptPrime && tokenData.payload.encryptPubKeyIss

  if(isTokenVerified) {
    let claimsEncrypted
    let encryptPubKeySub

    if(isDataEncrypted !== 'undefined' && isDataEncrypted.length > 1) {
      console.log('DATA ENCRYPTED IN REQ')
      const result = _handleEncryption({tokenData: tokenData})
      claimsEncrypted = result.cipherText
      encryptPubKeySub = result.encryptPubKeySub
    }

    const did = _getDID()
    const keys = _getSigningKeysFromWIF({WIF: WIF})
    const tokenPayload = TokenPayload.generateResponse({
      tokenData: tokenData,
      sub: did,
      pubKeySub: keys.pubKey,
      encryptPubKeySub: encryptPubKeySub ? encryptPubKeySub : '',
      claims: claimsEncrypted ? claimsEncrypted : {name: 'Natascha'}
    })

    const token = new TokenSigner('ES256K', keys.privKey).sign(tokenPayload)
    authenticateResponse({token: token, secretExchangeParty: initiatorParty}) // for test only

    return 'OK'

  } else {
    return new Error('Web Token Not Valid')
  }
}



export async function authenticateResponse({token, secretExchangeParty} :
  {token : string, secretExchangeParty: any}) {

  const tokenData = decodeToken(token)
  const isTokenVerified = new TokenVerifier('ES256k', tokenData.payload.pubKeySub).verify(token)
  const isDataEncrypted = tokenData.payload.encryptPrime && tokenData.payload.encryptPubKeyIss

  if(isTokenVerified) {
    if(isDataEncrypted !== 'undefined' && isDataEncrypted.length > 1) {
      console.log('CLAIMS IN RESPONSE ENCRYPTED')
      const claims = _handleDecryption({
        tokenData: tokenData,
        secretExchangeParty: secretExchangeParty
      })
      console.log('CLAIMS RETURN: ', claims)
      return claims
    }
    console.log('CLAIMS RETURN: ', tokenData.payload.claims)
    return tokenData.payload.claims
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


function _handleDecryption({tokenData, secretExchangeParty} :
  {tokenData: any, secretExchangeParty: any}) {

  const secret = getEncryptionSecret({
    party: secretExchangeParty,
    pubKey: tokenData.payload.encryptPubKeySub
  })

  const plainText = decrypt({key: secret, cipherText: tokenData.payload.claims})
  return plainText
}


function _handleEncryption({tokenData} : {tokenData :any}) {
  const encryptOptions = respondSecretExchange({prime: tokenData.payload.encryptPrime})
  const secret = getEncryptionSecret({
    party: encryptOptions.responder,
    pubKey: tokenData.payload.encryptPubKeyIss
  })

  const mockClaims = {name: 'Natascha', hobbie: 'day trading'}
  const cipherText = encrypt({key: secret, plainText: mockClaims})
  const result = {
    encryptPubKeySub: encryptOptions.responderKey,
    cipherText: cipherText
  }
  return result
}


function _getDID() {
  return 'did:jolo:f3ern3prgkpernn' // mock
}
