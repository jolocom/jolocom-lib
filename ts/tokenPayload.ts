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

  constructor({iss, pubKeyIss, reqClaims, IPFSroom} :
    {iss: string, pubKeyIss: string, reqClaims?: string[], IPFSroom?: string}) {
    this.iss = iss
    this.iat = new Date(Date.now())
    this.exp = new Date(Date.now() + 30000)
    this.jti = Math.random().toString(32)
    this.reqClaims = reqClaims
    this.IPFSroom = IPFSroom
    this.pubKeyIss = pubKeyIss
  }


  public static generateResponse({tokenData, sub, pubKeySub, claims} :
    {tokenData: any, sub: string, pubKeySub: string, claims?: any}
  ) {
    return Object.assign(tokenData, {
      iat: new Date(Date.now()),
      exp: new Date(Date.now() + 30000),
      sub: sub,
      pubKeySub: pubKeySub,
      claims: claims
    })
  }
}
