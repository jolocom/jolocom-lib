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
var class_transformer_1 = require("class-transformer");
var jsonld_1 = require("jsonld");
var linkedDataSignature_1 = require("../../linkedDataSignature");
var sections_1 = require("./sections");
var contexts_1 = require("../../utils/contexts");
var crypto_1 = require("../../utils/crypto");
var softwareProvider_1 = require("../../vaultedKeyProvider/softwareProvider");
var DidDocument = (function () {
    function DidDocument() {
        this._authentication = [];
        this._publicKey = [];
        this._service = [];
        this._created = new Date();
        this['_@context'] = contexts_1.defaultContextIdentity;
    }
    DidDocument_1 = DidDocument;
    Object.defineProperty(DidDocument.prototype, "context", {
        get: function () {
            return this['_@context'];
        },
        set: function (context) {
            this['_@context'] = context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "did", {
        get: function () {
            return this._id;
        },
        set: function (did) {
            this._id = did;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "authentication", {
        get: function () {
            return this._authentication;
        },
        set: function (authentication) {
            this._authentication = authentication;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "publicKey", {
        get: function () {
            return this._publicKey;
        },
        set: function (value) {
            this._publicKey = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "service", {
        get: function () {
            return this._service;
        },
        set: function (service) {
            this._service = service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "created", {
        get: function () {
            return this._created;
        },
        set: function (value) {
            this._created = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "signer", {
        get: function () {
            return {
                did: this._id,
                keyId: this._proof.creator
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "signature", {
        get: function () {
            return this._proof.signature;
        },
        set: function (signature) {
            this._proof.signature = signature;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DidDocument.prototype, "proof", {
        get: function () {
            return this._proof;
        },
        set: function (proof) {
            this._proof = proof;
        },
        enumerable: true,
        configurable: true
    });
    DidDocument.prototype.addAuthSection = function (section) {
        this.authentication.push(section);
    };
    DidDocument.prototype.addPublicKeySection = function (section) {
        this.publicKey.push(section);
    };
    DidDocument.prototype.addServiceEndpoint = function (endpoint) {
        this.service = [endpoint];
    };
    DidDocument.prototype.resetServiceEndpoints = function () {
        this.service = [];
    };
    DidDocument.fromPublicKey = function (publicKey) {
        var did = crypto_1.publicKeyToDID(publicKey);
        var keyId = did + "#keys-1";
        var didDocument = new DidDocument_1();
        didDocument.did = did;
        didDocument.addPublicKeySection(sections_1.PublicKeySection.fromEcdsa(publicKey, keyId, did));
        didDocument.addAuthSection(sections_1.AuthenticationSection.fromEcdsa(didDocument.publicKey[0]));
        didDocument.prepareSignature(keyId);
        return didDocument;
    };
    DidDocument.prototype.prepareSignature = function (keyId) {
        return __awaiter(this, void 0, void 0, function () {
            var inOneYear;
            return __generator(this, function (_a) {
                inOneYear = new Date();
                inOneYear.setFullYear(new Date().getFullYear() + 1);
                this._proof = new linkedDataSignature_1.EcdsaLinkedDataSignature();
                this._proof.creator = keyId;
                this._proof.signature = '';
                this._proof.nonce = softwareProvider_1.SoftwareKeyProvider.getRandom(8).toString('hex');
                return [2];
            });
        });
    };
    DidDocument.prototype.digest = function () {
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
    DidDocument.prototype.normalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                json = this.toJSON();
                delete json.proof;
                return [2, jsonld_1.canonize(json)];
            });
        });
    };
    DidDocument.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    DidDocument.fromJSON = function (json) {
        return class_transformer_1.plainToClass(DidDocument_1, json);
    };
    var DidDocument_1;
    __decorate([
        class_transformer_1.Expose({ name: '@context' })
    ], DidDocument.prototype, "context", null);
    __decorate([
        class_transformer_1.Expose({ name: 'id' })
    ], DidDocument.prototype, "did", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return sections_1.AuthenticationSection; })
    ], DidDocument.prototype, "authentication", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return sections_1.PublicKeySection; })
    ], DidDocument.prototype, "publicKey", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return sections_1.ServiceEndpointsSection; })
    ], DidDocument.prototype, "service", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Transform(function (value) { return value && value.toISOString(); }, { toPlainOnly: true }),
        class_transformer_1.Transform(function (value) { return value && new Date(value); }, { toClassOnly: true })
    ], DidDocument.prototype, "created", null);
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return linkedDataSignature_1.EcdsaLinkedDataSignature; }),
        class_transformer_1.Transform(function (value) { return value || new linkedDataSignature_1.EcdsaLinkedDataSignature(); }, { toClassOnly: true })
    ], DidDocument.prototype, "proof", null);
    DidDocument = DidDocument_1 = __decorate([
        class_transformer_1.Exclude()
    ], DidDocument);
    return DidDocument;
}());
exports.DidDocument = DidDocument;
//# sourceMappingURL=didDocument.js.map