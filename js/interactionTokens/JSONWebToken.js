"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var base64url_1 = require("base64url");
var jsontokens_1 = require("jsontokens");
var class_transformer_1 = require("class-transformer");
var types_1 = require("./types");
var crypto_1 = require("../utils/crypto");
var credentialOffer_1 = require("./credentialOffer");
var credentialResponse_1 = require("./credentialResponse");
var credentialRequest_1 = require("./credentialRequest");
var credentialsReceive_1 = require("./credentialsReceive");
var paymentRequest_1 = require("./paymentRequest");
var paymentResponse_1 = require("./paymentResponse");
var helper_1 = require("../utils/helper");
var convertPayload = function (args) { return (__assign({}, args, { interactionToken: payloadToJWT(args.interactionToken, args.typ) })); };
var JSONWebToken = (function () {
    function JSONWebToken() {
        this._header = {
            typ: 'JWT',
            alg: 'ES256K'
        };
        this._payload = {};
    }
    JSONWebToken_1 = JSONWebToken;
    Object.defineProperty(JSONWebToken.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        set: function (payload) {
            this._payload = payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "signature", {
        get: function () {
            return this._signature;
        },
        set: function (signature) {
            this._signature = signature;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "issuer", {
        get: function () {
            return this.payload.iss;
        },
        set: function (issuer) {
            this.payload.iss = issuer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "audience", {
        get: function () {
            return this.payload.aud;
        },
        set: function (audience) {
            this.payload.aud = audience;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "issued", {
        get: function () {
            return this.payload.iat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "expires", {
        get: function () {
            return this.payload.exp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "nonce", {
        get: function () {
            return this.payload.jti;
        },
        set: function (nonce) {
            this.payload.jti = nonce;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "interactionToken", {
        get: function () {
            return this.payload.interactionToken;
        },
        set: function (interactionToken) {
            this.payload.interactionToken = interactionToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "interactionType", {
        get: function () {
            return this.payload.typ;
        },
        set: function (type) {
            this.payload.typ = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "header", {
        get: function () {
            return this._header;
        },
        set: function (jwtHeader) {
            this._header = jwtHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONWebToken.prototype, "signer", {
        get: function () {
            return {
                did: helper_1.keyIdToDid(this.issuer),
                keyId: this.issuer
            };
        },
        enumerable: true,
        configurable: true
    });
    JSONWebToken.fromJWTEncodable = function (toEncode) {
        var jwt = new JSONWebToken_1();
        jwt.interactionToken = toEncode;
        return jwt;
    };
    JSONWebToken.prototype.setIssueAndExpiryTime = function () {
        this.payload.iat = Date.now();
        this.payload.exp = this.payload.iat + 3600000;
    };
    JSONWebToken.decode = function (jwt) {
        var interactionToken = JSONWebToken_1.fromJSON(jsontokens_1.decodeToken(jwt));
        helper_1.handleValidationStatus((interactionToken.expires > Date.now()), 'exp');
        return interactionToken;
    };
    JSONWebToken.prototype.encode = function () {
        if (!this.payload || !this.header || !this.signature) {
            throw new Error('The JWT is not complete, header / payload / signature are missing');
        }
        return [
            base64url_1.default.encode(JSON.stringify(this.header)),
            base64url_1.default.encode(JSON.stringify(this.payload)),
            this.signature
        ].join('.');
    };
    JSONWebToken.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var encode, toSign;
            return __generator(this, function (_a) {
                encode = base64url_1.default.encode;
                toSign = [encode(JSON.stringify(this.header)), encode(JSON.stringify(this.payload))].join('.');
                return [2, crypto_1.sha256(Buffer.from(toSign))];
            });
        });
    };
    JSONWebToken.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    JSONWebToken.fromJSON = function (json) {
        return class_transformer_1.plainToClass(JSONWebToken_1, json);
    };
    var JSONWebToken_1;
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return convertPayload(value); }, { toClassOnly: true })
    ], JSONWebToken.prototype, "payload", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return value || ''; })
    ], JSONWebToken.prototype, "signature", null);
    __decorate([
        class_transformer_1.Expose()
    ], JSONWebToken.prototype, "header", null);
    JSONWebToken = JSONWebToken_1 = __decorate([
        class_transformer_1.Exclude()
    ], JSONWebToken);
    return JSONWebToken;
}());
exports.JSONWebToken = JSONWebToken;
var payloadToJWT = function (payload, typ) {
    var _a;
    var payloadParserMap = (_a = {},
        _a[types_1.InteractionType.CredentialsReceive] = credentialsReceive_1.CredentialsReceive,
        _a[types_1.InteractionType.CredentialOffer] = credentialOffer_1.CredentialOffer,
        _a[types_1.InteractionType.CredentialRequest] = credentialRequest_1.CredentialRequest,
        _a[types_1.InteractionType.CredentialResponse] = credentialResponse_1.CredentialResponse,
        _a[types_1.InteractionType.PaymentRequest] = paymentRequest_1.PaymentRequest,
        _a[types_1.InteractionType.PaymentResponse] = paymentResponse_1.PaymentResponse,
        _a);
    var correspondingClass = payloadParserMap[typ];
    if (!correspondingClass) {
        throw new Error('Interaction type not recognized!');
    }
    return class_transformer_1.plainToClass(correspondingClass, payload);
};
//# sourceMappingURL=JSONWebToken.js.map