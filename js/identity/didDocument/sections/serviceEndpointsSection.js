"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ServiceEndpointsSection_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
let ServiceEndpointsSection = ServiceEndpointsSection_1 = class ServiceEndpointsSection {
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
    get serviceEndpoint() {
        return this._serviceEndpoint;
    }
    set serviceEndpoint(service) {
        this._serviceEndpoint = service;
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(ServiceEndpointsSection_1, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(id => id.replace(';', '#'), { toClassOnly: true, until: 0.13 })
], ServiceEndpointsSection.prototype, "id", null);
__decorate([
    class_transformer_1.Expose()
], ServiceEndpointsSection.prototype, "type", null);
__decorate([
    class_transformer_1.Expose()
], ServiceEndpointsSection.prototype, "serviceEndpoint", null);
__decorate([
    class_transformer_1.Expose()
], ServiceEndpointsSection.prototype, "description", null);
ServiceEndpointsSection = ServiceEndpointsSection_1 = __decorate([
    class_transformer_1.Exclude()
], ServiceEndpointsSection);
exports.ServiceEndpointsSection = ServiceEndpointsSection;
exports.generatePublicProfileServiceSection = (did, profileIpfsHash) => {
    const PubProfSec = new ServiceEndpointsSection();
    PubProfSec.id = `${did}#jolocomPubProfile`;
    PubProfSec.serviceEndpoint = `ipfs://${profileIpfsHash}`;
    PubProfSec.description = 'Verifiable Credential describing entity profile';
    PubProfSec.type = 'JolocomPublicProfile';
    return PubProfSec;
};
//# sourceMappingURL=serviceEndpointsSection.js.map