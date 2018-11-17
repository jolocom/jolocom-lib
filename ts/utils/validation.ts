import { JolocomLib } from '../index'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { IRegistry } from '../registries/types'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @returns True if signature is valid, valse otherwise
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, customRegistry) // true`
 */

export const validateDigestable = async (toVerify: IDigestable, registry?: IRegistry) => {
  const reg = registry || JolocomLib.registries.jolocom.create()
  const issuerIdentity = await reg.resolve(toVerify.signer.did)
  try {
    const issuerPublicKey = getIssuerPublicKey(toVerify.signer.keyId, issuerIdentity.didDocument )
    return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, toVerify)
  } catch {
    return false
  }
}
