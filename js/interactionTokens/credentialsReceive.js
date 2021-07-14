"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CredentialsReceive_1;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
let CredentialsReceive = CredentialsReceive_1 = class CredentialsReceive {
    get signedCredentials() {
        return this._signedCredentials;
    }
    set signedCredentials(signedCredentials) {
        this._signedCredentials = signedCredentials;
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(CredentialsReceive_1, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => signedCredential_1.SignedCredential)
], CredentialsReceive.prototype, "signedCredentials", null);
CredentialsReceive = CredentialsReceive_1 = __decorate([
    class_transformer_1.Exclude()
], CredentialsReceive);
exports.CredentialsReceive = CredentialsReceive;
//# sourceMappingURL=credentialsReceive.js.map