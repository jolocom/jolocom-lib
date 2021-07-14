"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SignedCredential_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const linkedData_1 = require("../../linkedData");
const linkedDataSignature_1 = require("../../linkedDataSignature");
const credential_1 = require("../credential/credential");
const errors_1 = require("../../errors");
const crypto_1 = require("../../utils/crypto");
const crypto_2 = require("crypto");
const DEFAULT_EXPIRY_MS = 365 * 24 * 3600 * 1000;
const generateClaimId = (length) => `claimId:${crypto_2.randomBytes(length).toString('hex')}`;
let SignedCredential = SignedCredential_1 = class SignedCredential {
    constructor() {
        this._id = generateClaimId(8);
        this._claim = {};
        this._proof = [new linkedDataSignature_1.EcdsaLinkedDataSignature()];
    }
    get context() {
        return this['_@context'];
    }
    set context(context) {
        this['_@context'] = context;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get issuer() {
        return this._issuer;
    }
    set issuer(issuer) {
        this._issuer = issuer;
    }
    get issued() {
        return this._issued;
    }
    set issued(issued) {
        this._issued = issued;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get signature() {
        return this._proof[0].signature;
    }
    set signature(signature) {
        this._proof[0].signature = signature;
    }
    get signer() {
        return {
            did: this.issuer,
            keyId: this._proof[0].creator,
        };
    }
    get expires() {
        return this._expires;
    }
    set expires(expiry) {
        this._expires = expiry;
    }
    get proof() {
        return this._proof[0];
    }
    get proofs() {
        return this._proof;
    }
    get proofChains() {
        const proofChains = {};
        this.proofs.forEach((sig) => {
            const keyId = sig.signer.keyId;
            const prevSigVal = sig.prevSignature;
            if (prevSigVal) {
                const prevSig = this.proofs.find((sig) => sig.signature === prevSigVal);
                const prevChain = proofChains[prevSig.signer.keyId];
                if (!prevSig || !prevChain) {
                    throw new Error("TODO handle inconsistency");
                }
                proofChains[keyId] = prevChain.concat(sig);
            }
            else {
                proofChains[keyId] = [sig];
            }
        });
        return proofChains;
    }
    async addChainedSignature(sig, prevSigKeyId) {
        if (!prevSigKeyId || !this.proofChains[prevSigKeyId]) {
            throw new Error("TODO handle inconsistency");
        }
        this._proof.push(sig);
    }
    set proof(proof) {
        this._proof[0] = proof;
    }
    get subject() {
        return this.claim.id;
    }
    set subject(subject) {
        this.claim.id = subject;
    }
    get claim() {
        return this._claim;
    }
    set claim(claim) {
        this._claim = claim;
    }
    get name() {
        return this._name || '';
    }
    set name(name) {
        this._name = name;
    }
    static async create(credentialOptions, issInfo, expires = new Date(Date.now() + DEFAULT_EXPIRY_MS)) {
        const credential = credential_1.Credential.create(credentialOptions);
        const json = credential.toJSON();
        const signedCredential = SignedCredential_1.fromJSON(json);
        signedCredential.expires = expires;
        signedCredential.issued = new Date();
        if (signedCredential.expires <= signedCredential.issued) {
            throw new Error(errors_1.ErrorCodes.VCInvalidExpiryDate);
        }
        await signedCredential.prepareSignature(issInfo.keyId);
        signedCredential.issuer = issInfo.issuerDid;
        return signedCredential;
    }
    async prepareSignature(keyId) {
        this.proof.creator = keyId;
        this.proof.signature = '';
        this.proof.nonce = (await crypto_1.getRandomBytes(8)).toString('hex');
    }
    async asBytes() {
        return linkedData_1.normalizeSignedLdObject(this.toJSON(), this.context);
    }
    async digest() {
        return linkedData_1.digestJsonLd(this.toJSON(), this.context);
    }
    static fromJSON(json) {
        return class_transformer_1.plainToClass(SignedCredential_1, json);
    }
    toJSON() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    class_transformer_1.Expose({ name: '@context' })
], SignedCredential.prototype, "context", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform(value => value || generateClaimId(8), { toClassOnly: true })
], SignedCredential.prototype, "id", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "issuer", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((value) => value && value.toISOString(), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform((value) => value && new Date(value), { toClassOnly: true })
], SignedCredential.prototype, "issued", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "type", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Transform((value) => value && value.toISOString(), {
        toPlainOnly: true,
    }),
    class_transformer_1.Transform((value) => value && new Date(value), { toClassOnly: true })
], SignedCredential.prototype, "expires", null);
__decorate([
    class_transformer_1.Expose(),
    class_transformer_1.Type(() => linkedDataSignature_1.EcdsaLinkedDataSignature),
    class_transformer_1.Transform(value => value || new linkedDataSignature_1.EcdsaLinkedDataSignature(), {
        toClassOnly: true,
    })
], SignedCredential.prototype, "proof", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "claim", null);
__decorate([
    class_transformer_1.Expose()
], SignedCredential.prototype, "name", null);
SignedCredential = SignedCredential_1 = __decorate([
    class_transformer_1.Exclude()
], SignedCredential);
exports.SignedCredential = SignedCredential;
//# sourceMappingURL=signedCredential.js.map