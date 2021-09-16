"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DidDocument_1;
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const linkedDataSignature_1 = require("../../linkedDataSignature");
const sections_1 = require("./sections");
const contexts_1 = require("../../utils/contexts");
const crypto_1 = require("../../utils/crypto");
const linkedData_1 = require("../../linkedData");
const utils_1 = require("../../didMethods/jolo/utils");
const LATEST_SPEC_VERSION = 0.13;
let DidDocument = DidDocument_1 = class DidDocument {
    constructor() {
        this._specVersion = LATEST_SPEC_VERSION;
        this._authentication = [];
        this._publicKey = [];
        this._service = [];
        this._created = new Date();
        this._updated = new Date();
        this._proof = new linkedDataSignature_1.EcdsaLinkedDataSignature();
        this._context = contexts_1.defaultContextIdentity;
        this._alsoKnownAs = [];
    }
    get alsoKnownAs() {
        if (!this._alsoKnownAs)
            this._alsoKnownAs = [];
        return this._alsoKnownAs;
    }
    set alsoKnownAs(alsoKnownAs) {
        this._alsoKnownAs = alsoKnownAs;
    }
    get specVersion() {
        return this._specVersion;
    }
    set specVersion(specVersion) {
        this._specVersion = specVersion;
    }
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
    }
    get did() {
        return this._id;
    }
    set did(did) {
        this._id = did;
    }
    get authentication() {
        return this._authentication;
    }
    set authentication(authentication) {
        authentication &&
            authentication.forEach(el => {
                if (typeof el === 'string') {
                    this._authentication.push(el);
                }
                else {
                    this._authentication.push(el.id);
                    this._publicKey.push(el);
                }
            });
        this._authentication = authentication;
    }
    get publicKey() {
        return this._publicKey;
    }
    set publicKey(value) {
        this._publicKey = value;
    }
    findPublicKeySectionById(keyId) {
        return this._publicKey.find(({ id }) => id === keyId || id === `#${keyId.split('#').pop()}`);
    }
    get service() {
        return this._service;
    }
    set service(service) {
        this._service = service;
    }
    get created() {
        return this._created;
    }
    set created(value) {
        this._created = value;
    }
    get updated() {
        return this._updated;
    }
    set updated(value) {
        this._updated = value;
    }
    get signer() {
        return {
            did: this._id,
            keyId: (this._proof && this._proof.creator) || this._publicKey[0].id,
        };
    }
    get signature() {
        return this._proof.signature;
    }
    set signature(signature) {
        this._proof.signature = signature;
    }
    get proof() {
        return this._proof;
    }
    set proof(proof) {
        this._proof = proof;
    }
    addAuthKeyId(authenticationKeyId) {
        this._authentication.push(authenticationKeyId);
    }
    addAuthKey(authenticationKey) {
        this._authentication.push(authenticationKey);
    }
    addPublicKeySection(section) {
        this._publicKey.push(section);
    }
    addServiceEndpoint(endpoint) {
        this.service = [endpoint];
    }
    resetServiceEndpoints() {
        this.service = [];
    }
    static async fromPublicKey(publicKey) {
        const did = utils_1.publicKeyToJoloDID(publicKey);
        const keyId = `${did}#keys-1`;
        const didDocument = new DidDocument_1();
        didDocument.did = did;
        didDocument.addPublicKeySection(sections_1.PublicKeySection.fromEcdsa(publicKey, keyId, did));
        didDocument.addAuthKeyId(didDocument.publicKey[0].id);
        return didDocument;
    }
    async sign(vaultedKeyProvider, signConfig) {
        this._proof = new linkedDataSignature_1.EcdsaLinkedDataSignature();
        this._proof.creator = this.signer.keyId;
        this._proof.signature = '';
        this._proof.nonce = (await crypto_1.getRandomBytes(8)).toString('hex');
        const signature = await vaultedKeyProvider.sign(signConfig, await this.asBytes());
        this._proof.signature = signature.toString('hex');
    }
    async asBytes() {
        return linkedData_1.normalizeSignedLdObject(this.toJSON(), this.context);
    }
    async digest() {
        return linkedData_1.digestJsonLd(this.toJSON(), this.context);
    }
    hasBeenUpdated() {
        this._updated = new Date();
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
    static fromJSON(json) {
        const options = json.id.startsWith('did:jolo')
            ? { version: json.specVersion || 0 }
            : undefined;
        return class_transformer_1.plainToClass(DidDocument_1, json, options);
    }
};
__decorate([
    class_transformer_1.Expose()
], DidDocument.prototype, "alsoKnownAs", null);
__decorate([
    class_transformer_1.Expose({ since: 0.13 })
], DidDocument.prototype, "specVersion", null);
__decorate([
    class_transformer_1.Expose({ name: '@context' }),
    class_transformer_1.Transform((val, obj) => {
        if (obj.id.startsWith('did:jolo'))
            return contexts_1.defaultContextIdentity;
        else
            return val;
    }, { toClassOnly: true })
], DidDocument.prototype, "context", null);
__decorate([
    class_transformer_1.Expose({ name: 'id' })
], DidDocument.prototype, "did", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(auths => auths &&
        auths.map(val => {
            const { type, publicKey } = val;
            return type === 'Secp256k1SignatureAuthentication2018' && !!publicKey
                ? publicKey
                : sections_1.PublicKeySection.fromJSON(val);
        }), { toClassOnly: true })
], DidDocument.prototype, "authentication", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((pubKeys, rest) => {
        const { verificationMethod } = rest;
        if (verificationMethod && verificationMethod.length) {
            return [...(pubKeys || []), ...verificationMethod];
        }
        return pubKeys || [];
    }, { toClassOnly: true }),
    class_transformer_1.Transform(pubKeys => pubKeys && pubKeys.map(sections_1.PublicKeySection.fromJSON))
], DidDocument.prototype, "publicKey", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => sections_1.ServiceEndpointsSection)
], DidDocument.prototype, "service", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((value) => value && value.toISOString(), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform((value) => value && new Date(value), { toClassOnly: true })
], DidDocument.prototype, "created", null);
__decorate([
    class_transformer_1.Expose({ since: 0.13 }),
    class_transformer_1.Transform((value) => value && value.toISOString(), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform((value) => value && new Date(value), { toClassOnly: true })
], DidDocument.prototype, "updated", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => linkedDataSignature_1.EcdsaLinkedDataSignature),
    class_transformer_1.Transform(value => value || new linkedDataSignature_1.EcdsaLinkedDataSignature(), {
        toClassOnly: true,
    })
], DidDocument.prototype, "proof", null);
DidDocument = DidDocument_1 = __decorate([
    class_transformer_1.Exclude()
], DidDocument);
exports.DidDocument = DidDocument;
//# sourceMappingURL=didDocument.js.map