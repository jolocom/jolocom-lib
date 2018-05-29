import * as QRCode from 'qrcode'

export class SSO {
  public async JWTtoQR(jwt: string): Promise<string> {
    return await QRCode.toDataURL(jwt)
  }
}
