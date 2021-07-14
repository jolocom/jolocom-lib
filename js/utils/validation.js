"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jolo_1 = require("../didMethods/jolo");
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const native_core_1 = require("@jolocom/native-core");
const identity_1 = require("../identity/identity");
const helper_1 = require("./helper");
const verifySignature = (data, signature, pKey, keyType) => {
    const compatibilityMap = {
        Secp256k1VerificationKey2018: 'EcdsaSecp256k1VerificationKey2019',
    };
    return vaulted_key_provider_1.getCryptoProvider(native_core_1.cryptoUtils).verify(pKey, compatibilityMap[keyType] || keyType, data, signature);
};
exports.verifySignatureWithIdentity = async (data, signature, signingKeyId, signer) => {
    const signingKey = signer.didDocument.findPublicKeySectionById(signingKeyId);
    if (!signingKey) {
        console.warn(`Signing key with id ${signingKeyId} not found in signer's DID Document`);
        return false;
    }
    return verifySignature(data, signature, signingKey.publicKeyHex
        ? Buffer.from(signingKey.publicKeyHex, 'hex')
        : Buffer.from(signingKey.publicKeyBase64, 'base64'), signingKey.type);
};
exports.validateDigestable = async (toValidate, resolverOrIdentity = new jolo_1.JoloDidMethod().resolver) => {
    const issuerIdentity = resolverOrIdentity instanceof identity_1.Identity
        ? resolverOrIdentity
        : await resolverOrIdentity.resolve(toValidate.signer.did);
    return exports.verifySignatureWithIdentity(await toValidate.asBytes(), helper_1.parseHexOrBase64(toValidate.signature), toValidate.signer.keyId, issuerIdentity);
};
exports.validateDigestables = async (toValidate, resolverOrIdentity = new jolo_1.JoloDidMethod().resolver) => Promise.all(toValidate.map(async (digestable) => exports.validateDigestable(digestable, resolverOrIdentity)));
//# sourceMappingURL=validation.js.map