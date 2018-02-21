export default class TokenPayload {
  public iss: string
  public sub: string
  public iat: Date
  public exp: Date
  public jti: string
  public reqClaims: string[]
  public clientId: string
  public callbackUrl: string
  public pubKeyIss: string
  public pubKeySub: string
  public claims: any
  public encryptPrime: string
  public encryptPubKeyIss: string
  public encryptPubKeySub: string


  constructor({
    iss,
    pubKeyIss,
    encryptPrime,
    encryptPubKeyIss,
    reqClaims,
    clientId,
    callbackUrl
  } : {
    iss: string,
    pubKeyIss: string,
    encryptPrime?: string,
    encryptPubKeyIss?: string,
    reqClaims?: string[],
    clientId?: string,
    callbackUrl: string
  }) {
    this.iss = iss
    this.pubKeyIss = pubKeyIss
    this.callbackUrl = callbackUrl
    this.reqClaims = reqClaims
    if (encryptPrime) { this.encryptPrime = encryptPrime }
    if (encryptPubKeyIss) { this.encryptPubKeyIss = encryptPubKeyIss }
    if (clientId) { this.clientId = clientId }
    this.iat = new Date(Date.now())
    this.exp = new Date(Date.now() + 3000000)
    this.jti = clientId ? clientId : Math.random().toString(32)
  }


  public static generateResponse({
    tokenData,
    sub,
    pubKeySub,
    encryptPubKeySub,
    claims
  } : {
    tokenData: any,
    sub: string,
    pubKeySub: string,
    encryptPubKeySub?: string,
    claims?: any
  }) {
    return Object.assign(tokenData.payload, {
      iat: new Date(Date.now()),
      exp: new Date(Date.now() + 3000000),
      sub: sub,
      pubKeySub: pubKeySub,
      encryptPubKeySub: encryptPubKeySub,
      claims: claims
    })
  }
}
