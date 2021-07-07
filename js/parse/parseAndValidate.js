"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const didDocument_1 = require("../identity/didDocument/didDocument");
const linkedData_1 = require("../linkedData");
const errors_1 = require("../errors");
const identity_1 = require("../identity/identity");
const validation_1 = require("../utils/validation");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
const parse_1 = require("./parse");
const helper_1 = require("../utils/helper");
const parseAndValidateDidDoc = async (didDocument) => {
    const didDoc = didDocument_1.DidDocument.fromJSON(didDocument);
    const signatureValid = await linkedData_1.validateJsonLd(didDocument, identity_1.Identity.fromDidDocument({ didDocument: didDoc }));
    if (signatureValid) {
        return didDoc;
    }
    throw new Error(errors_1.ErrorCodes.InvalidSignature);
};
const parseAndValidateSignedCredential = async (signedCredential, signer) => {
    const signedCred = signedCredential_1.SignedCredential.fromJSON(signedCredential);
    const signatureValid = await linkedData_1.validateJsonLd(signedCredential, signer);
    if (signatureValid) {
        return signedCred;
    }
    throw new Error(errors_1.ErrorCodes.InvalidSignature);
};
exports.parseAndValidateInteractionToken = async (jwt, signer) => {
    const interactionToken = parse_1.parse.interactionToken.fromJWT(jwt);
    const [body, payload, signature] = jwt.split('.');
    const isValid = await validation_1.verifySignatureWithIdentity(Buffer.from(Buffer.from([body, payload].join('.'))), helper_1.parseHexOrBase64(signature), interactionToken.signer.keyId, signer);
    if (isValid) {
        return interactionToken;
    }
    throw new Error(errors_1.ErrorCodes.InvalidSignature);
};
exports.parseAndValidate = {
    interactionToken: exports.parseAndValidateInteractionToken,
    didDocument: parseAndValidateDidDoc,
    signedCredential: parseAndValidateSignedCredential,
};
//# sourceMappingURL=parseAndValidate.js.map