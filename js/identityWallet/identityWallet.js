"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const credential_1 = require("../credentials/credential/credential");
const signedCredential_1 = require("../credentials/signedCredential/signedCredential");
const JSONWebToken_1 = require("../interactionTokens/JSONWebToken");
const types_1 = require("../interactionTokens/types");
const authentication_1 = require("../interactionTokens/authentication");
const credentialRequest_1 = require("../interactionTokens/credentialRequest");
const credentialResponse_1 = require("../interactionTokens/credentialResponse");
const helper_1 = require("../utils/helper");
const credentialOfferRequest_1 = require("../interactionTokens/credentialOfferRequest");
const credentialOfferResponse_1 = require("../interactionTokens/credentialOfferResponse");
const credentialsReceive_1 = require("../interactionTokens/credentialsReceive");
const errors_1 = require("../errors");
const jolo_1 = require("../didMethods/jolo");
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const cryptoProvider_1 = require("@jolocom/vaulted-key-provider/js/cryptoProvider");
const crypto_1 = require("../utils/crypto");
const native_core_1 = require("@jolocom/native-core");
const validation_1 = require("../utils/validation");
const rfc4648_1 = require("rfc4648");
class IdentityWallet {
    constructor({ identity, publicKeyMetadata, vaultedKeyProvider, }) {
        this.createSignedCred = async (_a, pass) => {
            var { expires } = _a, credentialParams = __rest(_a, ["expires"]);
            const vCred = await signedCredential_1.SignedCredential.create(Object.assign({ subject: credentialParams.subject || this.did }, credentialParams), {
                keyId: this.publicKeyMetadata.signingKeyId,
                issuerDid: this.did,
            }, expires);
            const signature = await this._keyProvider.sign({
                encryptionPass: pass,
                keyRef: this._publicKeyMetadata.signingKeyId,
            }, await vCred.asBytes());
            vCred.signature = signature.toString('hex');
            return vCred;
        };
        this.createMessage = async (args, pass, recieved) => {
            const jwt = JSONWebToken_1.JSONWebToken.fromJWTEncodable(args.message);
            jwt.interactionType = args.typ;
            if (args.aud)
                jwt.audience = args.aud;
            if (args.pca)
                jwt.payload.pca = args.pca;
            jwt.timestampAndSetExpiry(args.expires);
            return this.initializeAndSign(jwt, pass, recieved);
        };
        this.makeReq = (typ) => (_a, pass) => {
            var { expires, aud, pca } = _a, message = __rest(_a, ["expires", "aud", "pca"]);
            return this.createMessage({
                message: this.messageCannonicaliser(typ).fromJSON(message),
                typ,
                expires,
                aud,
                pca
            }, pass);
        };
        this.makeRes = (typ) => (_a, pass, recieved) => {
            var { expires, aud, pca } = _a, message = __rest(_a, ["expires", "aud", "pca"]);
            return this.createMessage({
                message: this.messageCannonicaliser(typ).fromJSON(message),
                typ,
                expires,
                aud,
                pca
            }, pass, recieved);
        };
        this.messageCannonicaliser = (typ) => {
            switch (typ) {
                case types_1.InteractionType.CredentialsReceive:
                    return credentialsReceive_1.CredentialsReceive;
                case types_1.InteractionType.CredentialOfferRequest:
                    return credentialOfferRequest_1.CredentialOfferRequest;
                case types_1.InteractionType.CredentialOfferResponse:
                    return credentialOfferResponse_1.CredentialOfferResponse;
                case types_1.InteractionType.CredentialRequest:
                    return credentialRequest_1.CredentialRequest;
                case types_1.InteractionType.CredentialResponse:
                    return credentialResponse_1.CredentialResponse;
                case types_1.InteractionType.Authentication:
                    return authentication_1.Authentication;
            }
            throw new Error(errors_1.ErrorCodes.JWTInvalidInteractionType);
        };
        this.getPublicKeys = (encryptionPass) => this._keyProvider.getPubKeys(encryptionPass);
        this.asymEncrypt = async (data, key, type) => cryptoProvider_1.getCryptoProvider(native_core_1.cryptoUtils).encrypt(key, type, data);
        this.asymEncryptToDidKey = async (data, keyRef, resolver = new jolo_1.JoloDidMethod().resolver) => resolver.resolve(helper_1.keyIdToDid(keyRef)).then(ident => {
            const pk = ident.publicKeySection.find(pk => keyRef.endsWith(pk.id));
            if (!pk)
                throw new Error(errors_1.ErrorCodes.PublicKeyNotFound);
            return this.asymEncrypt(data, Buffer.from(pk.publicKeyHex, 'hex'), pk.type);
        });
        this.asymEncryptToDid = async (data, did, resolver = new jolo_1.JoloDidMethod().resolver) => resolver.resolve(did).then(ident => {
            const encKey = ident.didDocument.publicKey.find(k => k.type === vaulted_key_provider_1.KeyTypes.x25519KeyAgreementKey2019);
            if (!encKey)
                throw new Error(errors_1.ErrorCodes.PublicKeyNotFound);
            return this.asymEncrypt(data, Buffer.from(encKey.publicKeyHex, 'hex'), encKey.type);
        });
        this.asymDecrypt = async (data, pass) => this._keyProvider.decrypt({
            encryptionPass: pass,
            keyRef: this._publicKeyMetadata.encryptionKeyId,
        }, data);
        this.sign = async (data, pass) => this._keyProvider.sign({
            encryptionPass: pass,
            keyRef: this._publicKeyMetadata.signingKeyId,
        }, data);
        this.create = {
            credential: credential_1.Credential.create,
            signedCredential: this.createSignedCred,
            message: this.createMessage,
            interactionTokens: {
                request: {
                    auth: this.makeReq(types_1.InteractionType.Authentication),
                    offer: this.makeReq(types_1.InteractionType.CredentialOfferRequest),
                    share: this.makeReq(types_1.InteractionType.CredentialRequest),
                },
                response: {
                    auth: this.makeRes(types_1.InteractionType.Authentication),
                    offer: this.makeRes(types_1.InteractionType.CredentialOfferResponse),
                    share: this.makeRes(types_1.InteractionType.CredentialResponse),
                    issue: this.makeRes(types_1.InteractionType.CredentialsReceive),
                },
            },
        };
        if (!identity || !publicKeyMetadata || !vaultedKeyProvider) {
            throw new Error(errors_1.ErrorCodes.IDWInvalidCreationArgs);
        }
        this.identity = identity;
        this.publicKeyMetadata = publicKeyMetadata;
        this._keyProvider = vaultedKeyProvider;
    }
    get did() {
        return this.identity.did;
    }
    set did(did) {
        this.identity.did = did;
    }
    get identity() {
        return this._identity;
    }
    set identity(identity) {
        this._identity = identity;
    }
    get didDocument() {
        return this.identity.didDocument;
    }
    set didDocument(didDocument) {
        this.identity.didDocument = didDocument;
    }
    get publicKeyMetadata() {
        return this._publicKeyMetadata;
    }
    set publicKeyMetadata(metadata) {
        this._publicKeyMetadata = metadata;
    }
    async initializeAndSign(jwt, pass, receivedJWT) {
        if (receivedJWT) {
            jwt.audience = receivedJWT.signer.did;
            jwt.nonce = receivedJWT.nonce;
        }
        else {
            jwt.nonce = (await crypto_1.getRandomBytes(8)).toString('hex');
        }
        const { signingKeyId } = this.publicKeyMetadata;
        const { type: signingKeyType } = await this._keyProvider.getPubKeyByController(pass, signingKeyId);
        jwt.issuer = signingKeyId;
        jwt.header = {
            typ: "JWT",
            alg: types_1.KeyTypeToJWA[signingKeyType]
        };
        const signature = await this._keyProvider.sign({
            encryptionPass: pass,
            keyRef: signingKeyId,
        }, await jwt.asBytes());
        jwt.signature = rfc4648_1.base64url.stringify(signature, { pad: false });
        return jwt;
    }
    async validateJWT(receivedJWT, sentJWT, resolver = new jolo_1.JoloDidMethod().resolver) {
        if (!(await validation_1.validateDigestable(receivedJWT, resolver))) {
            throw new Error(errors_1.ErrorCodes.IDWInvalidJWTSignature);
        }
        if (receivedJWT.expires < Date.now()) {
            throw new Error(errors_1.ErrorCodes.IDWTokenExpired);
        }
        if (sentJWT) {
            if (receivedJWT.audience !== sentJWT.signer.did) {
                throw new Error(errors_1.ErrorCodes.IDWNotCorrectResponder);
            }
            if (sentJWT.nonce !== receivedJWT.nonce) {
                throw new Error(errors_1.ErrorCodes.IDWIncorrectJWTNonce);
            }
        }
        else {
            if (receivedJWT.audience && receivedJWT.audience !== this.identity.did) {
                throw new Error(errors_1.ErrorCodes.IDWNotIntendedAudience);
            }
        }
    }
}
exports.IdentityWallet = IdentityWallet;
//# sourceMappingURL=identityWallet.js.map