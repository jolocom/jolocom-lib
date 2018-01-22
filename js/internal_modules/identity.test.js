"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs58 = require("bs58");
var chai_1 = require("chai");
var identity_1 = require("./identity");
describe('DID', function () {
    it('Should correctly instantiate a DID class from user public key', function () {
        var keyString = '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442';
        var publicKey = Buffer.from(keyString, 'utf8');
        var did = new identity_1.default(publicKey);
        var decoded = bs58.decode(did.identifier.slice(9));
        var did2 = new identity_1.default(decoded);
        console.log(did.identifier, did2.identifier);
        chai_1.expect(did.identifier).to.be.a('string');
        chai_1.expect(did.identifier).to.equal(did2.identifier);
    });
});
//# sourceMappingURL=identity.test.js.map