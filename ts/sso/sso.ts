import * as QRCode from 'qrcode'

/**
 * @class
 * Aggregates functionality related to the signle sign on process
 * @deprecated Will be removed in next major release
 */
export class SSO {
  /**
   * Encodes a JWT in a QR code and returns the image data
   * @param jwt - base64 encoded JSON web token
   * @param options - configuration for qr code generation, see {@link https://github.com/soldair/node-qrcode | documentation}
   */

  public async JWTtoQR(jwt: string, options?: object): Promise<string> {
    return await QRCode.toDataURL(jwt, options)
  }
}
