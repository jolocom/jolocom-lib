"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JSONWebToken_1;
Object.defineProperty(exports, "__esModule", { value: true });
const rfc4648_1 = require("rfc4648");
const jsontokens_1 = require("jsontokens");
const class_transformer_1 = require("class-transformer");
const types_1 = require("./types");
const types_2 = require("./types");
const crypto_1 = require("../utils/crypto");
const credentialResponse_1 = require("./credentialResponse");
const credentialRequest_1 = require("./credentialRequest");
const authentication_1 = require("./authentication");
const credentialsReceive_1 = require("./credentialsReceive");
const helper_1 = require("../utils/helper");
const credentialOfferResponse_1 = require("./credentialOfferResponse");
const credentialOfferRequest_1 = require("./credentialOfferRequest");
const errors_1 = require("../errors");
const DEFAULT_EXPIRY_MS = 60 * 60 * 1000;
const DEFAULT_JWT_HEADER = {
    typ: 'JWT',
    alg: types_1.SupportedJWA.ES256K
};
const convertPayload = (args) => (Object.assign(Object.assign({}, args), { interactionToken: payloadToJWT(args.interactionToken, args.typ) }));
let JSONWebToken = JSONWebToken_1 = class JSONWebToken {
    constructor() {
        this._payload = {};
        this.setIssueAndExpiryTime = this.timestampAndSetExpiry;
    }
    get payload() {
        return this._payload;
    }
    set payload(payload) {
        this._payload = payload;
    }
    get signature() {
        return this._signature;
    }
    set signature(signature) {
        this._signature = signature;
    }
    get issuer() {
        return this.payload.iss;
    }
    set issuer(issuer) {
        this.payload.iss = issuer;
    }
    get audience() {
        return this.payload.aud;
    }
    set audience(audience) {
        this.payload.aud = audience;
    }
    get issued() {
        return this.payload.iat;
    }
    get expires() {
        return this.payload.exp;
    }
    get nonce() {
        return this.payload.jti;
    }
    set nonce(nonce) {
        this.payload.jti = nonce;
    }
    get interactionToken() {
        return this.payload.interactionToken;
    }
    set interactionToken(interactionToken) {
        this.payload.interactionToken = interactionToken;
    }
    get interactionType() {
        return this.payload.typ;
    }
    set interactionType(type) {
        this.payload.typ = type;
    }
    get header() {
        return this._header;
    }
    set header(jwtHeader) {
        this._header = jwtHeader;
    }
    get signer() {
        return {
            did: helper_1.keyIdToDid(this.issuer),
            keyId: this.issuer,
        };
    }
    static fromJWTEncodable(toEncode, header = DEFAULT_JWT_HEADER) {
        const jwt = new JSONWebToken_1();
        jwt.header = header;
        jwt.interactionToken = toEncode;
        return jwt;
    }
    timestampAndSetExpiry(expiry = new Date(Date.now() + DEFAULT_EXPIRY_MS)) {
        const issued = new Date();
        if (expiry <= issued) {
            throw new Error(errors_1.ErrorCodes.JWTInvalidExpiryDate);
        }
        this.payload.iat = issued.getTime();
        this.payload.exp = expiry.getTime();
    }
    static decode(jwt) {
        return JSONWebToken_1.fromJSON(jsontokens_1.decodeToken(jwt));
    }
    encode() {
        if (!this.payload || !this.header || !this.signature) {
            throw new Error(errors_1.ErrorCodes.JWTIncomplete);
        }
        return [
            rfc4648_1.base64url.stringify(Buffer.from(JSON.stringify(this.header)), { pad: false }),
            rfc4648_1.base64url.stringify(Buffer.from(JSON.stringify(this.payload)), { pad: false }),
            this.signature,
        ].join('.');
    }
    async asBytes() {
        return Buffer.from([
            rfc4648_1.base64url.stringify(Buffer.from(JSON.stringify(this.header)), { pad: false }),
            rfc4648_1.base64url.stringify(Buffer.from(JSON.stringify(this.payload)), { pad: false }),
        ].join('.'));
    }
    async digest() {
        return crypto_1.sha256(await this.asBytes());
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(JSONWebToken_1, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(value => convertPayload(value), { toClassOnly: true })
], JSONWebToken.prototype, "payload", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(value => value || '')
], JSONWebToken.prototype, "signature", null);
__decorate([
    class_transformer_1.Expose()
], JSONWebToken.prototype, "header", null);
JSONWebToken = JSONWebToken_1 = __decorate([
    class_transformer_1.Exclude()
], JSONWebToken);
exports.JSONWebToken = JSONWebToken;
const payloadToJWT = (payload, typ) => {
    try {
        return instantiateInteraction(typ, c => class_transformer_1.plainToClass(c, payload));
    }
    catch (err) {
        return payload;
    }
};
const instantiateInteraction = (typ, instantiator) => {
    switch (typ) {
        case types_2.InteractionType.CredentialsReceive:
            return instantiator(credentialsReceive_1.CredentialsReceive);
        case types_2.InteractionType.CredentialOfferRequest:
            return instantiator(credentialOfferRequest_1.CredentialOfferRequest);
        case types_2.InteractionType.CredentialOfferResponse:
            return instantiator(credentialOfferResponse_1.CredentialOfferResponse);
        case types_2.InteractionType.CredentialRequest:
            return instantiator(credentialRequest_1.CredentialRequest);
        case types_2.InteractionType.CredentialResponse:
            return instantiator(credentialResponse_1.CredentialResponse);
        case types_2.InteractionType.Authentication:
            return instantiator(authentication_1.Authentication);
    }
    throw new Error(errors_1.ErrorCodes.JWTInvalidInteractionType);
};
//# sourceMappingURL=JSONWebToken.js.map