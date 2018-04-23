import * as superagent from 'superagent-es6-promise'
import TokenPayload from './tokenPayload'
import * as QRCode from 'qrcode'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import {
  initiateSecretExchange,
  respondSecretExchange,
  getEncryptionSecret,
  encrypt,
  decrypt
} from '../security/encryption'
import { getSigningKeysFromWIF } from '../utils/keysEncoding'

export default class Authentication {
  async initiateRequest({
    did,
    claims,
    clientId,
    WIF,
    encrypt,
    callbackUrl
  } : {
    did : string,
    claims : Array<string>,
    clientId? : string,
    WIF : string,
    encrypt: boolean,
    callbackUrl: string
  }) : Promise<any> {
    let response = {}

    const { pubKey, privKey } = getSigningKeysFromWIF({WIF})
    const args = {
      iss: did,
      reqClaims: claims,
      pubKeyIss: pubKey,
      callbackUrl: callbackUrl
    }

    if(clientId) {
      args['clientId'] = clientId
    }

    if(encrypt) {
      const { prime, initiatorKey, initiator } = initiateSecretExchange()
      args['encryptPrime'] = prime
      args['encryptPubKeyIss'] = initiatorKey
      response['initiator'] = initiator
    }

    const tokenPayload = new TokenPayload(args)
    const token = new TokenSigner('ES256k', privKey).sign(tokenPayload)

    response['qrCode'] = await this.createQRCode({token})
    response['token']= token
    return response
  }

  authenticateRequest({token} : {token : string}) {
    const tokenData = decodeToken(token)
    const { pubKeyIss } = tokenData.payload
    const isValid = new TokenVerifier('ES256k', pubKeyIss).verify(token)
    if(!isValid) {
      throw new Error('Web Token Not Valid')
    }

    return tokenData
  }

  async initiateResponse({
    tokenData,
    WIF,
    did,
    claims
  } : {
    tokenData: any,
    WIF: string,
    did: string,
    claims: Array<any>
  }) : Promise<any> {
    const { encryptPrime, encryptPubKeyIss } = tokenData.payload
    const isEncrypted = encryptPrime && encryptPubKeyIss

    let claimsEncrypted
    let encryptPubKeySub

    if(isEncrypted) {
      const enc = this.handleEncryption({tokenData, claims})
      claimsEncrypted = enc.cipherText
      encryptPubKeySub = enc.encryptPubKeySub
    }

    const keys = getSigningKeysFromWIF({WIF})

    const tokenPayload = TokenPayload.generateResponse({
      tokenData: tokenData,
      sub: did,
      pubKeySub: keys.pubKey,
      encryptPubKeySub: encryptPubKeySub ? encryptPubKeySub : '',
      claims: claimsEncrypted ? claimsEncrypted : claims
    })

    const token = new TokenSigner('ES256K', keys.privKey).sign(tokenPayload)
    return token
  }

  async authenticateResponse({token, secretExchangeParty} :
    {token : string, secretExchangeParty?: any}) : Promise<any> {

    const tokenData = decodeToken(token)
    const isTokenVerified = new TokenVerifier('ES256k', tokenData.payload.pubKeySub).verify(token)
    const isDataEncrypted = tokenData.payload.encryptPrime && tokenData.payload.encryptPubKeyIss

    if(isTokenVerified) {
      if (isDataEncrypted !== undefined) {
        const claims = this.handleDecryption({
          tokenData: tokenData,
          secretExchangeParty: secretExchangeParty
        })
        tokenData.payload.claims = claims
        return tokenData
      }

      return tokenData
    } else {
      return new Error('Web Token Not Valid')
    }
  }

  private handleDecryption({tokenData, secretExchangeParty} :
    {tokenData: any, secretExchangeParty: any}) {

    const secret = getEncryptionSecret({
      party: secretExchangeParty,
      pubKey: tokenData.payload.encryptPubKeySub
    })

    const plainText = decrypt({key: secret, cipherText: tokenData.payload.claims})
    return plainText
  }

  private handleEncryption({tokenData, claims} : {tokenData :any, claims: any}) {
    const encryptOptions = respondSecretExchange({prime: tokenData.payload.encryptPrime})
    const secret = getEncryptionSecret({
      party: encryptOptions.responder,
      pubKey: tokenData.payload.encryptPubKeyIss
    })
    const cipherText = encrypt({key: secret, plainText: claims})
    const result = {
      encryptPubKeySub: encryptOptions.responderKey,
      cipherText: cipherText
    }
    return result
  }

  private async createQRCode({token} : {token: string}) : Promise<any> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(token, (err, url) => {
        if(err) { reject(err) }
        resolve(url)
      })
    })
  }
}
