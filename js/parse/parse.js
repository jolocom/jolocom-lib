"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSONWebTokenParser_1 = require("../interactionTokens/JSONWebTokenParser");
var credential_1 = require("../credentials/credential/credential");
var signedCredential_1 = require("../credentials/signedCredential/signedCredential");
exports.parse = {
    interactionToken: JSONWebTokenParser_1.JSONWebTokenParser,
    credential: credential_1.Credential.fromJSON,
    signedCredential: signedCredential_1.SignedCredential.fromJSON,
};
//# sourceMappingURL=parse.js.map