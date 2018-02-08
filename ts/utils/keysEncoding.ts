import { ECPair } from 'bitcoinjs-lib'

export function getSigningKeysFromWIF({WIF} : {WIF : string}) {
  const keyPair = ECPair.fromWIF(WIF)
  let keys = {
    pubKey: keyPair.getPublicKeyBuffer().toString('hex'),
    privKey: keyPair.d.toBuffer(32).toString('hex')
  }
  return keys
}
