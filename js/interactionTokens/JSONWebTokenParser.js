"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONWebToken_1 = require("./JSONWebToken");
exports.JSONWebTokenParser = {
    fromJWT: (jwt) => JSONWebToken_1.JSONWebToken.decode(jwt),
    fromJSON: (json) => JSONWebToken_1.JSONWebToken.fromJSON(json),
};
//# sourceMappingURL=JSONWebTokenParser.js.map