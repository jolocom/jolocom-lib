"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("../../identity/identity");
const jolo_did_registrar_1 = require("@jolocom/jolo-did-registrar");
const didDocument_1 = require("../../identity/didDocument/didDocument");
const sections_1 = require("../../identity/didDocument/sections");
const helper_1 = require("../../utils/helper");
const protocol_ts_1 = require("@jolocom/protocol-ts");
const constants_1 = require("./constants");
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const validation_1 = require("../../utils/validation");
const constants_2 = require("./constants");
const utils_1 = require("./utils");
const ethereumjs_util_1 = require("ethereumjs-util");
const { SIGNING_KEY_REF, ANCHOR_KEY_REF, ENCRYPTION_KEY_REF } = constants_2.KEY_REFS;
class JolocomRegistrar {
    constructor(providerUrl = constants_1.PROVIDER_URL, contractAddress = constants_1.CONTRACT_ADDRESS, ipfsHost = constants_1.IPFS_ENDPOINT) {
        this.prefix = 'jolo';
        this.registrarFns = jolo_did_registrar_1.getRegistrar(providerUrl, contractAddress, ipfsHost);
    }
    async create(keyProvider, password) {
        let signingKey;
        let encryptionKey;
        if (keyProvider.id.startsWith(`did:${this.prefix}`)) {
            const existingSigningKey = await keyProvider
                .getPubKeyByController(password, `${keyProvider.id}#${SIGNING_KEY_REF}`)
                .catch(_ => {
                throw new Error(`Jolo registrar - No signing key with ref ${SIGNING_KEY_REF} found`);
            });
            const existingAnchoringKey = await keyProvider
                .getPubKeyByController(password, `${keyProvider.id}#${ANCHOR_KEY_REF}`)
                .catch(_ => {
                throw new Error(`Jolo registrar - No anchoring key with ref ${ANCHOR_KEY_REF} found`);
            });
            const existingEncryptionKey = await keyProvider
                .getPubKeyByController(password, `${keyProvider.id}#${ENCRYPTION_KEY_REF}`)
                .catch(_ => {
                throw new Error(`Jolo registrar - No encryption key with ref ${ENCRYPTION_KEY_REF} found`);
            });
            if (!existingSigningKey ||
                !existingAnchoringKey ||
                !existingEncryptionKey) {
                throw new Error('vault has jolo id, but is either missing the signing, anchoring, or encr key');
            }
            signingKey = existingSigningKey;
            encryptionKey = existingEncryptionKey;
        }
        else {
            signingKey = await keyProvider.newKeyPair(password, vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1VerificationKey2019, SIGNING_KEY_REF);
            const did = utils_1.publicKeyToJoloDID(Buffer.from(signingKey.publicKeyHex, 'hex'));
            await keyProvider.changeId(password, did);
            await keyProvider.setKeyController({
                encryptionPass: password,
                keyRef: signingKey.id,
            }, `${did}#${SIGNING_KEY_REF}`);
            await keyProvider.newKeyPair(password, vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1RecoveryMethod2020, `${did}#${ANCHOR_KEY_REF}`);
            encryptionKey = await keyProvider.newKeyPair(password, vaulted_key_provider_1.KeyTypes.x25519KeyAgreementKey2019, `${did}#${ENCRYPTION_KEY_REF}`);
        }
        const didDocumentInstace = await didDocument_1.DidDocument.fromPublicKey(Buffer.from(signingKey.publicKeyHex, 'hex'));
        didDocumentInstace.addPublicKeySection(sections_1.PublicKeySection.fromJSON(Object.assign({}, encryptionKey)));
        const identity = identity_1.Identity.fromDidDocument({
            didDocument: didDocumentInstace,
        });
        await this.signDidDocument(identity.didDocument, keyProvider, password);
        await this.update(identity.didDocument, keyProvider, password);
        return identity;
    }
    async didDocumentFromKeyProvider(keyProvider, password) {
        const did = keyProvider.id;
        const signingKey = await keyProvider.getPubKeyByController(password, `${did}#${SIGNING_KEY_REF}`);
        const encryptionKey = await keyProvider.getPubKeyByController(password, `${did}#${ENCRYPTION_KEY_REF}`);
        if (!signingKey || !encryptionKey) {
            throw new Error(`Could not find signing or encryption key. Vault id - ${did}`);
        }
        const didDocumentInstace = await didDocument_1.DidDocument.fromPublicKey(Buffer.from(signingKey.publicKeyHex, 'hex'));
        didDocumentInstace.addPublicKeySection(sections_1.PublicKeySection.fromJSON(Object.assign({}, encryptionKey)));
        const identity = identity_1.Identity.fromDidDocument({
            didDocument: didDocumentInstace,
        });
        await this.signDidDocument(identity.didDocument, keyProvider, password);
        return identity;
    }
    async updatePublicProfile(keyProvider, password, identity, publicProfile) {
        const { didDocument } = identity;
        if (!(await validation_1.validateDigestable(publicProfile, identity))) {
            throw new Error('Could not verify signature on the public profile. Update aborted.');
        }
        const pubProfSection = sections_1.ServiceEndpointsSection.fromJSON(await this.registrarFns.publishPublicProfile(identity.did, publicProfile));
        const oldPublicProfileEntry = didDocument.service.findIndex(({ type }) => type ===
            protocol_ts_1.claimsMetadata.publicProfile.type[protocol_ts_1.claimsMetadata.publicProfile.type.length - 1]);
        if (oldPublicProfileEntry !== -1) {
            didDocument.service.splice(oldPublicProfileEntry, 1, pubProfSection);
        }
        else {
            didDocument.addServiceEndpoint(pubProfSection);
        }
        identity.publicProfile = publicProfile;
        await this.signDidDocument(didDocument, keyProvider, password);
        return this.update(didDocument, keyProvider, password).then(() => true);
    }
    async encounter() {
        throw new Error(`"encounter" not implemented for did:${this.prefix}`);
    }
    async signDidDocument(didDocument, keyProvider, password) {
        didDocument.hasBeenUpdated();
        return didDocument.sign(keyProvider, {
            keyRef: `${keyProvider.id}#${SIGNING_KEY_REF}`,
            encryptionPass: password,
        });
    }
    async update(didDocument, keyProvider, password) {
        const anchoringKey = await keyProvider.getPubKeyByController(password, `${keyProvider.id}#${ANCHOR_KEY_REF}`);
        if (!anchoringKey) {
            throw new Error('No anchoring key found');
        }
        const unsignedTx = await this.registrarFns.publishDidDocument(Buffer.from(helper_1.stripHexPrefix(anchoringKey.publicKeyHex), 'hex'), didDocument.toJSON());
        await helper_1.fuelKeyWithEther(Buffer.from(anchoringKey.publicKeyHex, 'hex'));
        const signature = await keyProvider.sign({
            keyRef: anchoringKey.controller[0],
            encryptionPass: password,
        }, Buffer.from(helper_1.stripHexPrefix(unsignedTx), 'hex'));
        return this.registrarFns
            .broadcastTransaction(unsignedTx, {
            r: ethereumjs_util_1.addHexPrefix(signature.slice(0, 32).toString('hex')),
            s: ethereumjs_util_1.addHexPrefix(signature.slice(32, 64).toString('hex')),
            recoveryParam: signature[64],
        })
            .catch(console.log)
            .then(() => true);
    }
}
exports.JolocomRegistrar = JolocomRegistrar;
//# sourceMappingURL=registrar.js.map