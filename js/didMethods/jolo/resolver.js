"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jolo_did_resolver_1 = require("@jolocom/jolo-did-resolver");
const errors_1 = require("../../errors");
const did_resolver_1 = require("did-resolver");
const identity_1 = require("../../identity/identity");
const constants_1 = require("./constants");
const parseAndValidate_1 = require("../../parse/parseAndValidate");
class JolocomResolver {
    constructor(providerUrl = constants_1.PROVIDER_URL, contractAddress = constants_1.CONTRACT_ADDRESS, ipfsHost = constants_1.IPFS_ENDPOINT) {
        this.prefix = 'jolo';
        this.resolutionFunctions = {
            resolve: undefined,
            getPublicProfile: undefined,
        };
        this.resolutionFunctions.getPublicProfile = (didDoc) => jolo_did_resolver_1.getPublicProfile(didDoc, ipfsHost);
        this.resolutionFunctions.resolve = (did) => new did_resolver_1.Resolver(jolo_did_resolver_1.getResolver(providerUrl, contractAddress, ipfsHost)).resolve(did);
    }
    async resolve(did) {
        const jsonDidDoc = await this.resolutionFunctions.resolve(did).catch(_ => {
            throw new Error(errors_1.ErrorCodes.RegistryDIDNotAnchored);
        });
        const publicProfileJson = await this.resolutionFunctions.getPublicProfile(jsonDidDoc);
        const didDocument = await parseAndValidate_1.parseAndValidate.didDocument(jsonDidDoc);
        let publicProfile;
        if (publicProfileJson) {
            publicProfile = await parseAndValidate_1.parseAndValidate.signedCredential(publicProfileJson, identity_1.Identity.fromDidDocument({ didDocument }));
        }
        return identity_1.Identity.fromDidDocument({
            didDocument,
            publicProfile,
        });
    }
}
exports.JolocomResolver = JolocomResolver;
//# sourceMappingURL=resolver.js.map