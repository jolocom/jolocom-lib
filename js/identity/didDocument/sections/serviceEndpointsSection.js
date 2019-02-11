"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var class_transformer_1 = require("class-transformer");
var ServiceEndpointsSection = (function () {
    function ServiceEndpointsSection() {
    }
    ServiceEndpointsSection_1 = ServiceEndpointsSection;
    Object.defineProperty(ServiceEndpointsSection.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceEndpointsSection.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceEndpointsSection.prototype, "serviceEndpoint", {
        get: function () {
            return this._serviceEndpoint;
        },
        set: function (service) {
            this._serviceEndpoint = service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceEndpointsSection.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    ServiceEndpointsSection.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    ServiceEndpointsSection.fromJSON = function (json) {
        return class_transformer_1.plainToClass(ServiceEndpointsSection_1, json);
    };
    var ServiceEndpointsSection_1;
    __decorate([
        class_transformer_1.Expose()
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
    return ServiceEndpointsSection;
}());
exports.ServiceEndpointsSection = ServiceEndpointsSection;
exports.generatePublicProfileServiceSection = function (did, profileIpfsHash) {
    var PubProfSec = new ServiceEndpointsSection();
    PubProfSec.id = did + ";jolocomPubProfile";
    PubProfSec.serviceEndpoint = "ipfs://" + profileIpfsHash;
    PubProfSec.description = 'Verifiable Credential describing entity profile';
    PubProfSec.type = 'JolocomPublicProfile';
    return PubProfSec;
};
//# sourceMappingURL=serviceEndpointsSection.js.map