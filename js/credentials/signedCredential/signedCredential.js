"use strict";
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
require("reflect-metadata");
var class_transformer_1 = require("class-transformer");
var jsonld_1 = require("jsonld");
var crypto_1 = require("../../utils/crypto");
var linkedDataSignature_1 = require("../../linkedDataSignature");
var credential_1 = require("../credential/credential");
var softwareProvider_1 = require("../../vaultedKeyProvider/softwareProvider");
var SignedCredential = (function () {
    function SignedCredential() {
        this._id = generateClaimId(8);
        this._claim = {};
        this._proof = new linkedDataSignature_1.EcdsaLinkedDataSignature();
    }
    SignedCredential_1 = SignedCredential;
    Object.defineProperty(SignedCredential.prototype, "context", {
        get: function () {
            return this['_@context'];
        },
        set: function (context) {
            this['_@context'] = context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "issuer", {
        get: function () {
            return this._issuer;
        },
        set: function (issuer) {
            this._issuer = issuer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "issued", {
        get: function () {
            return this._issued;
        },
        set: function (issued) {
            this._issued = issued;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "signature", {
        get: function () {
            return this._proof.signature;
        },
        set: function (signature) {
            this._proof.signature = signature;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "signer", {
        get: function () {
            return {
                did: this.issuer,
                keyId: this._proof.creator
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "expires", {
        get: function () {
            return this._expires;
        },
        set: function (expiry) {
            this._expires = expiry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "proof", {
        get: function () {
            return this._proof;
        },
        set: function (proof) {
            this._proof = proof;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "subject", {
        get: function () {
            return this.claim.id;
        },
        set: function (subject) {
            this.claim.id = subject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "claim", {
        get: function () {
            return this._claim;
        },
        set: function (claim) {
            this._claim = claim;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignedCredential.prototype, "name", {
        get: function () {
            if (this._name) {
                return this._name;
            }
            var customType = this.type.find(function (t) { return t !== 'Credential'; });
            if (customType) {
                return customType.replace(/([A-Z])/g, ' $1').trim();
            }
            return 'Credential';
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    SignedCredential.create = function (credentialOptions, issInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var credential, json, signedCredential;
            return __generator(this, function (_a) {
                credential = credential_1.Credential.create(credentialOptions);
                json = credential.toJSON();
                signedCredential = SignedCredential_1.fromJSON(json);
                signedCredential.claim;
                signedCredential.prepareSignature(issInfo.keyId);
                signedCredential.issuer = issInfo.issuerDid;
                return [2, signedCredential];
            });
        });
    };
    SignedCredential.prototype.prepareSignature = function (keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var inOneYear;
            return __generator(this, function (_a) {
                inOneYear = new Date();
                inOneYear.setFullYear(new Date().getFullYear() + 1);
                this.issued = new Date();
                this.expires = inOneYear;
                this.proof.creator = keyId;
                this.proof.signature = '';
                this.proof.nonce = softwareProvider_1.SoftwareKeyProvider.getRandom(8).toString('hex');
                return [2];
            });
        });
    };
    SignedCredential.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var normalized, docSectionDigest, proofSectionDigest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.normalize()];
                    case 1:
                        normalized = _a.sent();
                        docSectionDigest = crypto_1.sha256(Buffer.from(normalized));
                        return [4, this.proof.digest()];
                    case 2:
                        proofSectionDigest = _a.sent();
                        return [2, crypto_1.sha256(Buffer.concat([proofSectionDigest, docSectionDigest]))];
                }
            });
        });
    };
    SignedCredential.prototype.normalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                json = this.toJSON();
                delete json.proof;
                return [2, jsonld_1.canonize(json)];
            });
        });
    };
    SignedCredential.fromJSON = function (json) {
        return class_transformer_1.plainToClass(SignedCredential_1, json);
    };
    SignedCredential.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    var SignedCredential_1;
    __decorate([
        class_transformer_1.Expose({ name: '@context' })
    ], SignedCredential.prototype, "context", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return value || generateClaimId(8); }, { toClassOnly: true })
    ], SignedCredential.prototype, "id", null);
    __decorate([
        class_transformer_1.Expose()
    ], SignedCredential.prototype, "issuer", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return value && value.toISOString(); }, { toPlainOnly: true }),
        class_transformer_1.Transform(function (value) { return value && new Date(value); }, { toClassOnly: true })
    ], SignedCredential.prototype, "issued", null);
    __decorate([
        class_transformer_1.Expose()
    ], SignedCredential.prototype, "type", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return value && value.toISOString(); }, { toPlainOnly: true }),
        class_transformer_1.Transform(function (value) { return value && new Date(value); }, { toClassOnly: true })
    ], SignedCredential.prototype, "expires", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return linkedDataSignature_1.EcdsaLinkedDataSignature; }),
        class_transformer_1.Transform(function (value) { return value || new linkedDataSignature_1.EcdsaLinkedDataSignature(); }, { toClassOnly: true })
    ], SignedCredential.prototype, "proof", null);
    __decorate([
        class_transformer_1.Expose()
    ], SignedCredential.prototype, "claim", null);
    __decorate([
        class_transformer_1.Expose()
    ], SignedCredential.prototype, "name", null);
    SignedCredential = SignedCredential_1 = __decorate([
        class_transformer_1.Exclude()
    ], SignedCredential);
    return SignedCredential;
}());
exports.SignedCredential = SignedCredential;
var generateClaimId = function (length) {
    return "claimId:" + crypto_1.generateRandomID(length);
};
//# sourceMappingURL=signedCredential.js.map