import * as QRCode from 'qrcode'

/* For options, please refer to qrcode npm package documentation
 * https://github.com/soldair/node-qrcode **/
export class SSO {
  public async JWTtoQR(jwt: string, options?: object): Promise<string> {
    return await QRCode.toDataURL(jwt, options)
  }
}
