"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
let CredentialOfferRequest = class CredentialOfferRequest {
    get callbackURL() {
        return this._callbackURL;
    }
    set callbackURL(callbackURL) {
        this._callbackURL = callbackURL;
    }
    get offeredCredentials() {
        return this._offeredCredentials;
    }
    set offeredCredentials(offeredCredentials) {
        this._offeredCredentials = offeredCredentials;
    }
    getRenderInfoForType(type) {
        return this.getOfferForType(type).renderInfo;
    }
    getMetadataForType(type) {
        return this.getOfferForType(type).metadata;
    }
    getRequestedInputForType(type) {
        return this.getOfferForType(type).requestedInput;
    }
    getOfferForType(type) {
        return this.offeredCredentials.find(offer => offer.type === type);
    }
    get offeredTypes() {
        return this.offeredCredentials.map(({ type }) => type);
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
], CredentialOfferRequest.prototype, "callbackURL", null);
__decorate([
    class_transformer_1.Expose()
], CredentialOfferRequest.prototype, "offeredCredentials", null);
CredentialOfferRequest = __decorate([
    class_transformer_1.Exclude()
], CredentialOfferRequest);
exports.CredentialOfferRequest = CredentialOfferRequest;
//# sourceMappingURL=credentialOfferRequest.js.map