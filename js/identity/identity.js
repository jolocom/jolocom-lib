"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Identity_1;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const didDocument_1 = require("./didDocument/didDocument");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
let Identity = Identity_1 = class Identity {
    get did() {
        return this.didDocument.did;
    }
    set did(did) {
        this.didDocument.did = did;
    }
    get didDocument() {
        return this._didDocument;
    }
    set didDocument(didDocument) {
        this._didDocument = didDocument;
    }
    get serviceEndpointSections() {
        return this.didDocument.service;
    }
    get publicKeySection() {
        return this.didDocument.publicKey;
    }
    get publicProfile() {
        return this._publicProfileCredential;
    }
    set publicProfile(publicProfile) {
        this._publicProfileCredential = publicProfile;
    }
    static fromDidDocument({ didDocument, publicProfile, }) {
        const identity = new Identity_1();
        identity.didDocument = didDocument;
        if (publicProfile) {
            identity.publicProfile = publicProfile;
        }
        return identity;
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(Identity_1, json);
    }
};
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => didDocument_1.DidDocument)
], Identity.prototype, "didDocument", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => signedCredential_1.SignedCredential)
], Identity.prototype, "publicProfile", null);
Identity = Identity_1 = __decorate([
    class_transformer_1.Exclude()
], Identity);
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map