"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EcdsaLinkedDataSignature_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const jsonld_1 = require("jsonld");
const crypto_1 = require("../../utils/crypto");
const contexts_1 = require("../../utils/contexts");
const helper_1 = require("../../utils/helper");
let EcdsaLinkedDataSignature = EcdsaLinkedDataSignature_1 = class EcdsaLinkedDataSignature {
    constructor() {
        this._type = 'EcdsaKoblitzSignature2016';
        this._creator = '';
        this._created = new Date();
        this._nonce = '';
        this._signatureValue = '';
    }
    get created() {
        return this._created;
    }
    set created(created) {
        this._created = created;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get nonce() {
        return this._nonce;
    }
    set nonce(nonce) {
        this._nonce = nonce;
    }
    get signature() {
        return this._signatureValue;
    }
    set signature(signature) {
        this._signatureValue = signature;
    }
    get creator() {
        return this._creator;
    }
    set creator(creator) {
        this._creator = creator;
    }
    get signer() {
        return {
            did: helper_1.keyIdToDid(this.creator),
            keyId: this.creator,
        };
    }
    async normalize() {
        const json = this.toJSON();
        json['@context'] = contexts_1.defaultContext;
        delete json.signatureValue;
        delete json.type;
        delete json.id;
        return jsonld_1.canonize(json);
    }
    async asBytes() {
        return Buffer.from(await this.normalize());
    }
    async digest() {
        const normalized = await this.normalize();
        return crypto_1.sha256(Buffer.from(normalized));
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(EcdsaLinkedDataSignature_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((value) => value && new Date(value), { toClassOnly: true }),
    class_transformer_1.Transform((value) => value && value.toISOString(), {
        toPlainOnly: true,
    })
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
exports.EcdsaLinkedDataSignature = EcdsaLinkedDataSignature;
//# sourceMappingURL=ecdsaKoblitzSignature2016.js.map