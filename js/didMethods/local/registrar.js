"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("../../identity/identity");
const local_resolver_registrar_1 = require("@jolocom/local-resolver-registrar");
const didDocument_1 = require("../../identity/didDocument/didDocument");
const db_1 = require("@jolocom/local-resolver-registrar/js/db");
const native_core_1 = require("@jolocom/native-core");
class LocalRegistrar {
    constructor(db = db_1.createDb()) {
        this.prefix = 'jun';
        this.registrar = local_resolver_registrar_1.getRegistrar({
            dbInstance: db,
            create: native_core_1.getIcp,
            getIdFromEvent: native_core_1.getIdFromEvent,
            validateEvents: native_core_1.validateEvents,
        });
    }
    async create(keyProvider, password) {
        const ret = (await this.registrar.create({
            encryptedWallet: keyProvider.encryptedWallet,
            id: keyProvider.id,
            pass: password,
        }));
        keyProvider._encryptedWallet = Buffer.from(ret.encryptedWallet, 'base64');
        keyProvider._id = ret.id;
        const didDoc = JSON.parse(await native_core_1.validateEvents(ret.inceptionEvent));
        const identity = identity_1.Identity.fromDidDocument({
            didDocument: didDocument_1.DidDocument.fromJSON(didDoc),
        });
        await this.encounter(ret.inceptionEvent);
        return identity;
    }
    async updatePublicProfile(keyProvider, password, identity, publicProfile) {
        console.error(`"updatePublicProfile not implemented for did:${this.prefix}`);
        return false;
    }
    async encounter(deltas) {
        const didDocJson = JSON.parse(await this.registrar.update(deltas));
        return identity_1.Identity.fromDidDocument({
            didDocument: didDocument_1.DidDocument.fromJSON(didDocJson),
        });
    }
}
exports.LocalRegistrar = LocalRegistrar;
//# sourceMappingURL=registrar.js.map