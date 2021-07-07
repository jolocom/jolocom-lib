"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONWebTokenParser_1 = require("../interactionTokens/JSONWebTokenParser");
const credential_1 = require("../credentials/credential/credential");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
exports.parse = {
    interactionToken: JSONWebTokenParser_1.JSONWebTokenParser,
    credential: credential_1.Credential.fromJSON,
    signedCredential: (json) => signedCredential_1.SignedCredential.fromJSON(json),
};
//# sourceMappingURL=parse.js.map