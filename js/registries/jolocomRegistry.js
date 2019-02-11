"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var identityWallet_1 = require("../identityWallet/identityWallet");
var didDocument_1 = require("../identity/didDocument/didDocument");
var signedCredential_1 = require("../credentials/signedCredential/signedCredential");
var identity_1 = require("../identity/identity");
var ipfs_1 = require("../ipfs/ipfs");
var didConnector_1 = require("../ethereum/didConnector");
var crypto_1 = require("../utils/crypto");
var types_1 = require("../vaultedKeyProvider/types");
var serviceEndpointsSection_1 = require("../identity/didDocument/sections/serviceEndpointsSection");
var JolocomRegistry = (function () {
    function JolocomRegistry() {
    }
    JolocomRegistry.prototype.create = function (vaultedKeyProvider, decryptionPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var jolocomIdentityKey, ethereumKey, derivationArgs, publicIdentityKey, didDocument, didDocumentSignature, identity, identityWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jolocomIdentityKey = types_1.KeyTypes.jolocomIdentityKey, ethereumKey = types_1.KeyTypes.ethereumKey;
                        derivationArgs = {
                            derivationPath: jolocomIdentityKey,
                            encryptionPass: decryptionPassword
                        };
                        publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs);
                        return [4, didDocument_1.DidDocument.fromPublicKey(publicIdentityKey)];
                    case 1:
                        didDocument = _a.sent();
                        return [4, vaultedKeyProvider.signDigestable(derivationArgs, didDocument)];
                    case 2:
                        didDocumentSignature = _a.sent();
                        didDocument.signature = didDocumentSignature.toString('hex');
                        identity = identity_1.Identity.fromDidDocument({ didDocument: didDocument });
                        identityWallet = new identityWallet_1.IdentityWallet({
                            identity: identity,
                            vaultedKeyProvider: vaultedKeyProvider,
                            publicKeyMetadata: {
                                derivationPath: jolocomIdentityKey,
                                keyId: didDocument.publicKey[0].id
                            }
                        });
                        return [4, this.commit({
                                identityWallet: identityWallet,
                                vaultedKeyProvider: vaultedKeyProvider,
                                keyMetadata: {
                                    encryptionPass: decryptionPassword,
                                    derivationPath: ethereumKey
                                }
                            })];
                    case 3:
                        _a.sent();
                        return [2, identityWallet];
                }
            });
        });
    };
    JolocomRegistry.prototype.commit = function (commitArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var identityWallet, keyMetadata, vaultedKeyProvider, didDocument, publicProfile, remote, remotePubProf, publicProfileHash, publicProfileSection, ipfsHash, privateEthKey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identityWallet = commitArgs.identityWallet, keyMetadata = commitArgs.keyMetadata, vaultedKeyProvider = commitArgs.vaultedKeyProvider;
                        didDocument = identityWallet.didDocument;
                        publicProfile = identityWallet.identity.publicProfile;
                        return [4, this.resolveSafe(didDocument.did)];
                    case 1:
                        remote = _a.sent();
                        remotePubProf = remote && remote.publicProfile;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!publicProfile) return [3, 4];
                        return [4, this.ipfsConnector.storeJSON({ data: publicProfile.toJSON(), pin: true })];
                    case 3:
                        publicProfileHash = _a.sent();
                        publicProfileSection = serviceEndpointsSection_1.generatePublicProfileServiceSection(didDocument.did, publicProfileHash);
                        didDocument.addServiceEndpoint(publicProfileSection);
                        _a.label = 4;
                    case 4:
                        if (remotePubProf && !publicProfile) {
                            didDocument.resetServiceEndpoints();
                        }
                        return [4, this.ipfsConnector.storeJSON({ data: didDocument.toJSON(), pin: true })];
                    case 5:
                        ipfsHash = _a.sent();
                        privateEthKey = vaultedKeyProvider.getPrivateKey(keyMetadata);
                        return [4, this.ethereumConnector.updateDIDRecord({
                                ethereumKey: privateEthKey,
                                did: didDocument.did,
                                newHash: ipfsHash
                            })];
                    case 6:
                        _a.sent();
                        return [3, 8];
                    case 7:
                        error_1 = _a.sent();
                        throw new Error("Error occured while persisting identity data: " + error_1.message);
                    case 8: return [2];
                }
            });
        });
    };
    JolocomRegistry.prototype.resolve = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var ddoHash, didDocument, _a, _b, publicProfileSection, publicProfile, _c, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        return [4, this.ethereumConnector.resolveDID(did)];
                    case 1:
                        ddoHash = _d.sent();
                        if (!ddoHash) {
                            throw new Error('No record for DID found.');
                        }
                        _b = (_a = didDocument_1.DidDocument).fromJSON;
                        return [4, this.ipfsConnector.catJSON(ddoHash)];
                    case 2:
                        didDocument = _b.apply(_a, [(_d.sent())]);
                        publicProfileSection = didDocument.service.find(function (endpoint) { return endpoint.type === 'JolocomPublicProfile'; });
                        _c = publicProfileSection;
                        if (!_c) return [3, 4];
                        return [4, this.fetchPublicProfile(publicProfileSection.serviceEndpoint)];
                    case 3:
                        _c = (_d.sent());
                        _d.label = 4;
                    case 4:
                        publicProfile = _c;
                        return [2, identity_1.Identity.fromDidDocument({
                                didDocument: didDocument,
                                publicProfile: publicProfile
                            })];
                    case 5:
                        error_2 = _d.sent();
                        throw new Error("Could not retrieve DID Document. " + error_2.message);
                    case 6: return [2];
                }
            });
        });
    };
    JolocomRegistry.prototype.authenticate = function (vaultedKeyProvider, derivationArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var publicIdentityKey, did, identity, publicKeyMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs);
                        did = crypto_1.publicKeyToDID(publicIdentityKey);
                        return [4, this.resolve(did)];
                    case 1:
                        identity = _a.sent();
                        publicKeyMetadata = {
                            derivationPath: derivationArgs.derivationPath,
                            keyId: identity.publicKeySection[0].id
                        };
                        return [2, new identityWallet_1.IdentityWallet({
                                vaultedKeyProvider: vaultedKeyProvider,
                                identity: identity,
                                publicKeyMetadata: publicKeyMetadata
                            })];
                }
            });
        });
    };
    JolocomRegistry.prototype.fetchPublicProfile = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, publicProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = entry.replace('ipfs://', '');
                        return [4, this.ipfsConnector.catJSON(hash)];
                    case 1:
                        publicProfile = (_a.sent());
                        return [2, signedCredential_1.SignedCredential.fromJSON(publicProfile)];
                }
            });
        });
    };
    JolocomRegistry.prototype.resolveSafe = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4, this.resolve(did)];
                    case 1: return [2, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2];
                    case 3: return [2];
                }
            });
        });
    };
    return JolocomRegistry;
}());
exports.JolocomRegistry = JolocomRegistry;
exports.createJolocomRegistry = function (_a) {
    var _b = _a === void 0 ? {
        ipfsConnector: ipfs_1.jolocomIpfsStorageAgent,
        ethereumConnector: didConnector_1.jolocomEthereumResolver
    } : _a, ipfsConnector = _b.ipfsConnector, ethereumConnector = _b.ethereumConnector;
    var jolocomRegistry = new JolocomRegistry();
    jolocomRegistry.ipfsConnector = ipfsConnector;
    jolocomRegistry.ethereumConnector = ethereumConnector;
    return jolocomRegistry;
};
//# sourceMappingURL=jolocomRegistry.js.map