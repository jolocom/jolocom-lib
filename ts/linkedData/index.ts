import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import { getIssuerPublicKey } from './helper'
import { IRegistry } from '../registries/types'
import { registries } from '../registries/index'
import { sha256 } from '../utils/crypto'
import { canonize } from 'jsonld'

/**
 * Helper function to handle JsonLD normalization.
 * @dev The function expects the JsonLD '@context' to be passed as an argument,
 *  the '@context' on the data will be discarded.
 * @param data - {@link JsonLdObject} without the '@context' section
 * @param context - JsonLD context to use during normalization
 */

export const normalizeJsonLd = async ({ ['@context']: _, ...data }, context) => {
  return canonize(data, {
    expandContext: context,
  })
}

export const normalizeLdProof = async (
  //@ts-ignore
  proof: ILinkedDataSignatureAttrs,
  context,
): Promise<string> => {
  const { signatureValue, id, type, ...toNormalize } = proof
  //@ts-ignore
  return normalizeJsonLd(toNormalize, context)
}

export const digestJsonLd = async (
    {proof, ...data},
): Promise<Buffer> => sha256(Buffer.concat([
    sha256(Buffer.from(await normalizeLdProof(proof, data['@context']))),
    //@ts-ignore
    sha256(Buffer.from(await normalizeJsonLd(data, data['@context'])))
]))


export const validateJsonLd = async (
    json,
    customRegistry?: IRegistry
): Promise<boolean> => {
    const reg = customRegistry || registries.jolocom.create()
    console.log(json)
    try {
        const issuerIdentity = await reg.resolve(json.proof.creator)
        const issuerPublicKey = getIssuerPublicKey(
            json.proof.id,
            issuerIdentity.didDocument,
        )
        return SoftwareKeyProvider.verify(
            await digestJsonLd(json),
            issuerPublicKey,
            Buffer.from(json.proof.signatureValue, 'hex')
        )
    } catch {
        return false
    }

}
