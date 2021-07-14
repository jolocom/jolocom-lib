"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
let CredentialOfferResponse = class CredentialOfferResponse {
    get callbackURL() {
        return this._callbackURL;
    }
    set callbackURL(callbackURL) {
        this._callbackURL = callbackURL;
    }
    get selectedCredentials() {
        return this._selectedCredentials;
    }
    set selectedCredentials(selectedCredentials) {
        this._selectedCredentials = selectedCredentials;
    }
    satisfiesRequest({ offeredTypes }) {
        if (offeredTypes.length !== this.selectedCredentials.length) {
            return false;
        }
        const selectedTypes = this.selectedCredentials.map(selected => selected.type);
        return selectedTypes.every(requestedType => offeredTypes.includes(requestedType));
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(this, json);
    }
};
__decorate([
    class_transformer_1.Expose()
], CredentialOfferResponse.prototype, "callbackURL", null);
__decorate([
    class_transformer_1.Expose()
], CredentialOfferResponse.prototype, "selectedCredentials", null);
CredentialOfferResponse = __decorate([
    class_transformer_1.Exclude()
], CredentialOfferResponse);
exports.CredentialOfferResponse = CredentialOfferResponse;
//# sourceMappingURL=credentialOfferResponse.js.map