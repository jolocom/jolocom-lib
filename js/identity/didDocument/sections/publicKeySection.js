"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PublicKeySection_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
let PublicKeySection = PublicKeySection_1 = class PublicKeySection {
    get controller() {
        return this._controller;
    }
    set controller(controller) {
        this._controller = controller;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get publicKeyHex() {
        return this._publicKeyHex;
    }
    set publicKeyHex(keyHex) {
        this._publicKeyHex = keyHex;
    }
    static fromEcdsa(publicKey, id, did) {
        const publicKeySecion = new PublicKeySection_1();
        publicKeySecion.controller = did;
        publicKeySecion.id = id;
        publicKeySecion.type = 'EcdsaSecp256k1VerificationKey2019';
        publicKeySecion.publicKeyHex = publicKey.toString('hex');
        return publicKeySecion;
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(PublicKeySection_1, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((val, obj) => val || (obj.id && obj.id.split('#')[0]), {
        toClassOnly: true,
        until: 0.13,
    }),
    class_transformer_1.Transform((val, obj) => obj.owner || val, { toClassOnly: true, until: 0.13 })
], PublicKeySection.prototype, "controller", null);
__decorate([
    class_transformer_1.Expose()
], PublicKeySection.prototype, "id", null);
__decorate([
    class_transformer_1.Expose()
], PublicKeySection.prototype, "type", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((val, obj) => !val && obj.publicKeyBase64
        ? Buffer.from(obj.publicKeyBase64, 'base64').toString('hex')
        : val, {
        toClassOnly: true,
    })
], PublicKeySection.prototype, "publicKeyHex", null);
PublicKeySection = PublicKeySection_1 = __decorate([
    class_transformer_1.Exclude()
], PublicKeySection);
exports.PublicKeySection = PublicKeySection;
//# sourceMappingURL=publicKeySection.js.map