import { ECPair } from 'bitcoinjs-lib'

export function getSigningKeysFromWIF({WIF}: {WIF: string}) {
  const keyPair = ECPair.fromWIF(WIF)
  const keys = {
    pubKey: keyPair.getPublicKeyBuffer().toString('hex'),
    privKey: keyPair.d.toBuffer(32).toString('hex')
  }
  return keys
}
