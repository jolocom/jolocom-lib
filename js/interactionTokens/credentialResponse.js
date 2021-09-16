"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
let CredentialResponse = class CredentialResponse {
    get suppliedCredentials() {
        return this._suppliedCredentials;
    }
    set suppliedCredentials(suppliedCredentials) {
        this._suppliedCredentials = suppliedCredentials;
    }
    get callbackURL() {
        return this._callbackURL;
    }
    set callbackURL(callbackURL) {
        this._callbackURL = callbackURL;
    }
    satisfiesRequest(cr) {
        const credentials = this.suppliedCredentials.map(sCredClass => sCredClass.toJSON());
        const validCredentials = cr.applyConstraints(credentials);
        return (!!this.suppliedCredentials.length &&
            this.suppliedCredentials.length === validCredentials.length);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(this, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => signedCredential_1.SignedCredential)
], CredentialResponse.prototype, "suppliedCredentials", null);
__decorate([
    class_transformer_1.Expose()
], CredentialResponse.prototype, "callbackURL", null);
CredentialResponse = __decorate([
    class_transformer_1.Exclude()
], CredentialResponse);
exports.CredentialResponse = CredentialResponse;
//# sourceMappingURL=credentialResponse.js.map