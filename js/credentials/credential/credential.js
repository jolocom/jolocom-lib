"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Credential_1;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const contexts_1 = require("../../utils/contexts");
let Credential = Credential_1 = class Credential {
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get claim() {
        return this._claim;
    }
    set claim(claim) {
        this._claim = claim;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get context() {
        return this['_@context'];
    }
    set context(context) {
        this['_@context'] = context;
    }
    static create({ metadata, claim, subject, }) {
        const credential = new Credential_1();
        credential.context = [...contexts_1.defaultContext, ...metadata.context];
        credential.type = metadata.type;
        credential.name = metadata.name;
        credential.claim = claim;
        credential.claim.id = subject;
        return credential;
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(Credential_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose()
], Credential.prototype, "claim", null);
__decorate([
    class_transformer_1.Expose()
], Credential.prototype, "type", null);
__decorate([
    class_transformer_1.Expose()
], Credential.prototype, "name", null);
__decorate([
    class_transformer_1.Expose({ name: '@context' })
], Credential.prototype, "context", null);
Credential = Credential_1 = __decorate([
    class_transformer_1.Exclude()
], Credential);
exports.Credential = Credential;
//# sourceMappingURL=credential.js.map