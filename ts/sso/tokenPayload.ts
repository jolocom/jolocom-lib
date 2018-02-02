export default class TokenPayload {
  public iss: string
  public sub: string
  public iat: Date
  public exp: Date
  public jti: string
  public reqClaims: string[]
  public IPFSroom: string
  public pubKeyIss: string
  public pubKeySub: string
  public claims: any
  public encryptPrime: string
  public encryptPubKeyIss: string
  public encryptPubKeySub: string

  constructor({iss, pubKeyIss, encryptPrime, encryptPubKeyIss, reqClaims, IPFSroom} :
    {
      iss: string,
      pubKeyIss: string,
      encryptPrime?: string,
      encryptPubKeyIss?: string,
      reqClaims?: string[],
      IPFSroom?: string
    }) {
    this.iss = iss
    this.iat = new Date(Date.now())
    this.exp = new Date(Date.now() + 3000000)
    this.jti = Math.random().toString(32)
    this.reqClaims = reqClaims
    this.IPFSroom = IPFSroom
    this.pubKeyIss = pubKeyIss
    this.encryptPrime = encryptPrime
    this.encryptPubKeyIss = encryptPubKeyIss
  }


  public static generateResponse({tokenData, sub, pubKeySub, encryptPubKeySub, claims} :
    {tokenData: any, sub: string, pubKeySub: string, encryptPubKeySub?: string, claims?: any}
  ) {

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
