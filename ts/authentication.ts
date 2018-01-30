import * as superagent from 'superagent-es6-promise'
import testAuth from '../tests/data/authentication'
import { signMessage, verifySignedMessage } from './sign-verify'
import * as QRCode from 'qrcode'
import { TokenSigner } from 'jsontokens'

// TODO: implement interface for claim and IPFS room + add did
export async function createQRCode(
  did : String,
  claims : Array<any>,
  IPFSroom : String
) : Promise<any> {
  const privKey = testAuth.rawPrivateKey

  const token = new TokenSigner('ES256k', privKey).sign({
    did: did,
    claims: claims,
    IPFSroom: IPFSroom
  })

  QRCode.toDataURL(token, (err, url) => {
    if(err) {
      return err
    }
    return url
  })
}

createQRCode('deed', ['name'], 'kernjreng')
