"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const crypto_1 = require("../utils/crypto");
const jsonld_1 = require("jsonld");
const jolo_1 = require("../didMethods/jolo");
const validation_1 = require("../utils/validation");
const identity_1 = require("../identity/identity");
exports.normalizeJsonLd = async (_a, context) => {
    var { ['@context']: _ } = _a, data = __rest(_a, ['@context']);
    return jsonld_1.canonize(data, {
        expandContext: context,
    });
};
const normalizeLdProof = async (_a, context) => {
    var { signatureValue, id, type } = _a, toNormalize = __rest(_a, ["signatureValue", "id", "type"]);
    return exports.normalizeJsonLd(toNormalize, context);
};
exports.normalizeSignedLdObject = async (_a, context) => {
    var { proof, ['@context']: _ } = _a, data = __rest(_a, ["proof", '@context']);
    return Buffer.concat([
        crypto_1.sha256(Buffer.from(await normalizeLdProof(proof, context))),
        crypto_1.sha256(Buffer.from(await exports.normalizeJsonLd(data, context))),
    ]);
};
exports.digestJsonLd = async (signedLdObject, context) => crypto_1.sha256(await exports.normalizeSignedLdObject(signedLdObject, context));
exports.validateJsonLd = async (json, resolverOrIdentity = new jolo_1.JoloDidMethod().resolver) => {
    const issuerIdentity = resolverOrIdentity instanceof identity_1.Identity
        ? resolverOrIdentity
        : await resolverOrIdentity.resolve(helper_1.keyIdToDid(json.proof.creator));
    return validation_1.verifySignatureWithIdentity(await exports.normalizeSignedLdObject(json, json['@context']), helper_1.parseHexOrBase64(json.proof.signatureValue), json.proof.creator, issuerIdentity);
};
//# sourceMappingURL=index.js.map