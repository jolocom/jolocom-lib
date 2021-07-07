"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const didDocument_1 = require("../../identity/didDocument/didDocument");
const identity_1 = require("../../identity/identity");
const local_resolver_registrar_1 = require("@jolocom/local-resolver-registrar");
const native_core_1 = require("@jolocom/native-core");
const did_resolver_1 = require("did-resolver");
class LocalResolver {
    constructor(db, didDocFromValidatedEvents = native_core_1.validateEvents) {
        this.prefix = 'jun';
        this.db = db;
        this.resolveImplementation = (did) => new did_resolver_1.Resolver(local_resolver_registrar_1.getResolver(this.prefix)({
            dbInstance: db,
            validateEvents: didDocFromValidatedEvents,
        })).resolve(did);
    }
    async resolve(did) {
        const jsonDidDoc = await this.resolveImplementation(did).catch(e => {
            throw new Error(errors_1.ErrorCodes.RegistryDIDNotAnchored);
        });
        return identity_1.Identity.fromDidDocument({
            didDocument: didDocument_1.DidDocument.fromJSON(jsonDidDoc),
        });
    }
}
exports.LocalResolver = LocalResolver;
//# sourceMappingURL=resolver.js.map