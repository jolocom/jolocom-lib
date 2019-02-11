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
var contexts_1 = require("../../utils/contexts");
var helper_1 = require("../../utils/helper");
var EcdsaLinkedDataSignature = (function () {
    function EcdsaLinkedDataSignature() {
        this._type = 'EcdsaKoblitzSignature2016';
        this._creator = '';
        this._created = new Date();
        this._nonce = '';
        this._signatureValue = '';
    }
    EcdsaLinkedDataSignature_1 = EcdsaLinkedDataSignature;
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "created", {
        get: function () {
            return this._created;
        },
        set: function (created) {
            this._created = created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "nonce", {
        get: function () {
            return this._nonce;
        },
        set: function (nonce) {
            this._nonce = nonce;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "signature", {
        get: function () {
            return this._signatureValue;
        },
        set: function (signature) {
            this._signatureValue = signature;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "creator", {
        get: function () {
            return this._creator;
        },
        set: function (creator) {
            this._creator = creator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EcdsaLinkedDataSignature.prototype, "signer", {
        get: function () {
            return {
                did: helper_1.keyIdToDid(this.creator),
                keyId: this.creator
            };
        },
        enumerable: true,
        configurable: true
    });
    EcdsaLinkedDataSignature.prototype.normalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                json = this.toJSON();
                json['@context'] = contexts_1.defaultContext;
                delete json.signatureValue;
                delete json.type;
                delete json.id;
                return [2, jsonld_1.canonize(json)];
            });
        });
    };
    EcdsaLinkedDataSignature.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var normalized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.normalize()];
                    case 1:
                        normalized = _a.sent();
                        return [2, crypto_1.sha256(Buffer.from(normalized))];
                }
            });
        });
    };
    EcdsaLinkedDataSignature.fromJSON = function (json) {
        return class_transformer_1.plainToClass(EcdsaLinkedDataSignature_1, json);
    };
    EcdsaLinkedDataSignature.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    var EcdsaLinkedDataSignature_1;
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return Date; }),
        class_transformer_1.Transform(function (value) { return value && value.toISOString(); }, { toPlainOnly: true })
    ], EcdsaLinkedDataSignature.prototype, "created", null);
    __decorate([
        class_transformer_1.Expose()
    ], EcdsaLinkedDataSignature.prototype, "type", null);
    __decorate([
        class_transformer_1.Expose()
    ], EcdsaLinkedDataSignature.prototype, "nonce", null);
    __decorate([
        class_transformer_1.Expose({ name: 'signatureValue' })
    ], EcdsaLinkedDataSignature.prototype, "signature", null);
    __decorate([
        class_transformer_1.Expose()
    ], EcdsaLinkedDataSignature.prototype, "creator", null);
    EcdsaLinkedDataSignature = EcdsaLinkedDataSignature_1 = __decorate([
        class_transformer_1.Exclude()
    ], EcdsaLinkedDataSignature);
    return EcdsaLinkedDataSignature;
}());
exports.EcdsaLinkedDataSignature = EcdsaLinkedDataSignature;
//# sourceMappingURL=ecdsaKoblitzSignature2016.js.map