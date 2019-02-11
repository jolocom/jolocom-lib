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
var credential_1 = require("../credentials/credential/credential");
var signedCredential_1 = require("../credentials/signedCredential/signedCredential");
var JSONWebToken_1 = require("../interactionTokens/JSONWebToken");
var types_1 = require("../interactionTokens/types");
var credentialOffer_1 = require("../interactionTokens/credentialOffer");
var authentication_1 = require("../interactionTokens/authentication");
var credentialRequest_1 = require("../interactionTokens/credentialRequest");
var credentialResponse_1 = require("../interactionTokens/credentialResponse");
var paymentRequest_1 = require("../interactionTokens/paymentRequest");
var paymentResponse_1 = require("../interactionTokens/paymentResponse");
var softwareProvider_1 = require("../vaultedKeyProvider/softwareProvider");
var helper_1 = require("../utils/helper");
var crypto_1 = require("../utils/crypto");
var jolocomRegistry_1 = require("../registries/jolocomRegistry");
var credentialsReceive_1 = require("../interactionTokens/credentialsReceive");
var IdentityWallet = (function () {
    function IdentityWallet(_a) {
        var identity = _a.identity, publicKeyMetadata = _a.publicKeyMetadata, vaultedKeyProvider = _a.vaultedKeyProvider;
        var _this = this;
        this.createSignedCred = function (params, pass) { return __awaiter(_this, void 0, void 0, function () {
            var derivationPath, vCred, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        derivationPath = this.publicKeyMetadata.derivationPath;
                        return [4, signedCredential_1.SignedCredential.create(__assign({ subject: params.subject || this.did }, params), {
                                keyId: this.publicKeyMetadata.keyId,
                                issuerDid: this.did
                            })];
                    case 1:
                        vCred = _a.sent();
                        return [4, this.vaultedKeyProvider.signDigestable({ derivationPath: derivationPath, encryptionPass: pass }, vCred)];
                    case 2:
                        signature = _a.sent();
                        vCred.signature = signature.toString('hex');
                        return [2, vCred];
                }
            });
        }); };
        this.createAuth = function (authArgs, pass, receivedJWT) { return __awaiter(_this, void 0, void 0, function () {
            var authenticationReq, jwt;
            return __generator(this, function (_a) {
                authenticationReq = authentication_1.Authentication.fromJSON(authArgs);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(authenticationReq);
                jwt.interactionType = types_1.InteractionType.Authentication;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)];
            });
        }); };
        this.createCredOffer = function (credOffer, pass, receivedJWT) { return __awaiter(_this, void 0, void 0, function () {
            var offer, jwt;
            return __generator(this, function (_a) {
                offer = credentialOffer_1.CredentialOffer.fromJSON(credOffer);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(offer);
                jwt.interactionType = types_1.InteractionType.CredentialOffer;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)];
            });
        }); };
        this.createCredReq = function (credReq, pass) { return __awaiter(_this, void 0, void 0, function () {
            var credentialRequest, jwt;
            return __generator(this, function (_a) {
                credentialRequest = credentialRequest_1.CredentialRequest.fromJSON(credReq);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(credentialRequest);
                jwt.interactionType = types_1.InteractionType.CredentialRequest;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)];
            });
        }); };
        this.createCredResp = function (credResp, pass, receivedJWT) { return __awaiter(_this, void 0, void 0, function () {
            var credentialResponse, jwt;
            return __generator(this, function (_a) {
                credentialResponse = credentialResponse_1.CredentialResponse.fromJSON(credResp);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(credentialResponse);
                jwt.interactionType = types_1.InteractionType.CredentialResponse;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)];
            });
        }); };
        this.createCredReceive = function (credReceive, pass, receivedJWT) { return __awaiter(_this, void 0, void 0, function () {
            var credentialReceieve, jwt;
            return __generator(this, function (_a) {
                credentialReceieve = credentialsReceive_1.CredentialsReceive.fromJSON(credReceive);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(credentialReceieve);
                jwt.interactionType = types_1.InteractionType.CredentialsReceive;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)];
            });
        }); };
        this.createPaymentReq = function (paymentReq, pass) { return __awaiter(_this, void 0, void 0, function () {
            var paymentRequest, jwt;
            return __generator(this, function (_a) {
                paymentRequest = paymentRequest_1.PaymentRequest.fromJSON(paymentReq);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(paymentRequest);
                jwt.interactionType = types_1.InteractionType.PaymentRequest;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)];
            });
        }); };
        this.createPaymentResp = function (paymentResp, pass, receivedJWT) { return __awaiter(_this, void 0, void 0, function () {
            var paymentResponse, jwt;
            return __generator(this, function (_a) {
                paymentResponse = paymentResponse_1.PaymentResponse.fromJSON(paymentResp);
                jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(paymentResponse);
                jwt.interactionType = types_1.InteractionType.PaymentResponse;
                return [2, this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass, receivedJWT)];
            });
        }); };
        this.create = {
            credential: credential_1.Credential.create,
            signedCredential: this.createSignedCred,
            interactionTokens: {
                request: {
                    auth: this.createAuth,
                    offer: this.createCredOffer,
                    share: this.createCredReq,
                    payment: this.createPaymentReq
                },
                response: {
                    auth: this.createAuth,
                    offer: this.createCredOffer,
                    share: this.createCredResp,
                    issue: this.createCredReceive,
                    payment: this.createPaymentResp
                },
            },
        };
        if (!identity || !publicKeyMetadata || !vaultedKeyProvider) {
            throw new Error('Missing argunments! Expected identity, publicKeyMetadata, and vaulterKeyProvider');
        }
        this.identity = identity;
        this.publicKeyMetadata = publicKeyMetadata;
        this.vaultedKeyProvider = vaultedKeyProvider;
    }
    IdentityWallet.prototype.getPublicKey = function (keyDerivarionArgs) {
        return this._vaultedKeyProvider.getPublicKey(keyDerivarionArgs);
    };
    Object.defineProperty(IdentityWallet.prototype, "did", {
        get: function () {
            return this.identity.did;
        },
        set: function (did) {
            this.identity.did = did;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdentityWallet.prototype, "identity", {
        get: function () {
            return this._identity;
        },
        set: function (identity) {
            this._identity = identity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdentityWallet.prototype, "didDocument", {
        get: function () {
            return this.identity.didDocument;
        },
        set: function (didDocument) {
            this.identity.didDocument = didDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdentityWallet.prototype, "publicKeyMetadata", {
        get: function () {
            return this._publicKeyMetadata;
        },
        set: function (metadata) {
            this._publicKeyMetadata = metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdentityWallet.prototype, "vaultedKeyProvider", {
        get: function () {
            return this._vaultedKeyProvider;
        },
        set: function (keyProvider) {
            this._vaultedKeyProvider = keyProvider;
        },
        enumerable: true,
        configurable: true
    });
    IdentityWallet.prototype.initializeAndSign = function (jwt, derivationPath, pass, receivedJWT) {
        return __awaiter(this, void 0, void 0, function () {
            var signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt.setIssueAndExpiryTime();
                        jwt.issuer = this.publicKeyMetadata.keyId;
                        receivedJWT ? (jwt.audience = helper_1.keyIdToDid(receivedJWT.issuer)) : null;
                        receivedJWT ? (jwt.nonce = receivedJWT.nonce) : (jwt.nonce = crypto_1.generateRandomID(8));
                        return [4, this.vaultedKeyProvider.signDigestable({ derivationPath: derivationPath, encryptionPass: pass }, jwt)];
                    case 1:
                        signature = _a.sent();
                        jwt.signature = signature.toString('hex');
                        return [2, jwt];
                }
            });
        });
    };
    IdentityWallet.prototype.validateJWT = function (receivedJWT, sendJWT, customRegistry) {
        return __awaiter(this, void 0, void 0, function () {
            var registry, remoteIdentity, pubKey, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        registry = customRegistry || jolocomRegistry_1.createJolocomRegistry();
                        return [4, registry.resolve(helper_1.keyIdToDid(receivedJWT.issuer))];
                    case 1:
                        remoteIdentity = _b.sent();
                        pubKey = helper_1.getIssuerPublicKey(receivedJWT.issuer, remoteIdentity.didDocument);
                        _a = helper_1.handleValidationStatus;
                        return [4, softwareProvider_1.SoftwareKeyProvider.verifyDigestable(pubKey, receivedJWT)];
                    case 2:
                        _a.apply(void 0, [_b.sent(), 'sig']);
                        sendJWT && helper_1.handleValidationStatus(receivedJWT.audience === this.identity.did, 'aud');
                        sendJWT && helper_1.handleValidationStatus(sendJWT.nonce === receivedJWT.nonce, 'nonce');
                        return [2];
                }
            });
        });
    };
    return IdentityWallet;
}());
exports.IdentityWallet = IdentityWallet;
//# sourceMappingURL=identityWallet.js.map