import { JolocomLib } from '../index'
import { IDigestable } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { IRegistry } from '../registries/types'

/**
 * Validates the signature on a {@link SignedCredential} or {@link JSONWebToken}
 * @param toValidate - Instance of object implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @returns True if signature is valid, false otherwise
 * @example `await validateDigestable(signedCredential) // true`
 * @example `await validateDigestable(signedCredential, customRegistry) // true`
 */

export const validateDigestable = async (
    toValidate: IDigestable,
    customRegistry?: IRegistry
): Promise<boolean> => {
    const reg = customRegistry || JolocomLib.registries.jolocom.create()
    const issuerIdentity = await reg.resolve(toValidate.signer.did)
    try {
        const issuerPublicKey = getIssuerPublicKey(
            toValidate.signer.keyId,
            issuerIdentity.didDocument
        )
        return JolocomLib.KeyProvider.verifyDigestable(issuerPublicKey, toValidate)
    } catch {
        return false
    }
}

/**
 * Validates the signatures on an array of {@link SignedCredential}s or {@link JSONWebToken}s
 * @param toValidate - Array of objects implementing the {@link IDigestable} interface
 * @param customRegistry - Custom registry implementation. If null, the {@link JolocomRegistry} is used
 * @returns Array<boolean> where true if signature is valid, false otherwise
 * @example `await validateDigestable(signedCredentials) // [true, false...]`
 * @example `await validateDigestable(signedCredentials, customRegistry) // [true, false...]`
 */

export const validateDigestables = async (
    toValidate: Array<IDigestable>,
    customRegistry?: IRegistry
): Promise<Array<boolean>> =>
    Promise.all(
        toValidate.map(async digestable =>
            validateDigestable(digestable, customRegistry)
        )
    )
