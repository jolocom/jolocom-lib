"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CredentialRequest_1;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonlogic = require("json-logic-js");
const class_transformer_1 = require("class-transformer");
let CredentialRequest = CredentialRequest_1 = class CredentialRequest {
    constructor() {
        this._credentialRequirements = [];
    }
    get credentialRequirements() {
        return this._credentialRequirements;
    }
    set credentialRequirements(requirements) {
        this._credentialRequirements = requirements;
    }
    get callbackURL() {
        return this._callbackURL;
    }
    set callbackURL(callback) {
        this._callbackURL = callback;
    }
    get requestedCredentialTypes() {
        return this.credentialRequirements.map(credential => credential.type);
    }
    applyConstraints(credentials) {
        return credentials.filter(credential => {
            const relevantConstraints = this.credentialRequirements.find(section => areCredTypesEqual(section.type, credential.type));
            if (!relevantConstraints) {
                return false;
            }
            if (!relevantConstraints.constraints.length) {
                return credential;
            }
            const combinedRequirements = { and: relevantConstraints.constraints };
            if (relevantConstraints) {
                return jsonlogic.apply(combinedRequirements, credential);
            }
        });
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(CredentialRequest_1, json);
    }
};
__decorate([
    class_transformer_1.Expose()
], CredentialRequest.prototype, "credentialRequirements", null);
__decorate([
    class_transformer_1.Expose()
], CredentialRequest.prototype, "callbackURL", null);
CredentialRequest = CredentialRequest_1 = __decorate([
    class_transformer_1.Exclude()
], CredentialRequest);
exports.CredentialRequest = CredentialRequest;
exports.constraintFunctions = {
    is: (field, value) => assembleStatement('==', field, value),
    not: (field, value) => assembleStatement('!=', field, value),
    greater: (field, value) => assembleStatement('>', field, value),
    smaller: (field, value) => assembleStatement('<', field, value),
};
const assembleStatement = (operator, field, value) => ({ [operator]: [{ var: field }, value] });
const areCredTypesEqual = (first, second) => first.every((el, index) => el === second[index]);
//# sourceMappingURL=credentialRequest.js.map