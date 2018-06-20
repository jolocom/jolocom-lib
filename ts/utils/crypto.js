"use strict";
exports.__esModule = true;
var createHash = require("create-hash");
var secp256k1 = require("secp256k1");
var ethereumjs_util_1 = require("ethereumjs-util");
function sha256(data) {
    return createHash('sha256').update(data).digest();
}
exports.sha256 = sha256;
function sign(data, privateKey) {
    var hash = sha256(Buffer.from(data));
    var sigObj = secp256k1.sign(hash, privateKey);
    return sigObj.signature.toString('base64');
}
exports.sign = sign;
function verifySignature(data, publicKey, signature) {
    var hash = sha256(Buffer.from(data));
    return secp256k1.verify(hash, signature, publicKey);
}
exports.verifySignature = verifySignature;
function publicKeyToDID(publicKey) {
    var prefix = 'did:jolo:';
    var suffix = ethereumjs_util_1.keccak256(publicKey);
    return prefix + suffix.toString('hex');
}
exports.publicKeyToDID = publicKeyToDID;
function privateKeyToDID(privateKey) {
    var pubKey = secp256k1.publicKeyCreate(privateKey);
    return publicKeyToDID(pubKey);
}
exports.privateKeyToDID = privateKeyToDID;
// TODO Seed properly, causes issues on RN due to lack of default csrng operations.
function generateRandomID(nrOfBytes) {
    return Math.random().toString(16).substr(2);
    /*
    const result = Buffer.allocUnsafe(nrOfBytes)
    random.randomWords(nrOfBytes / 4).forEach((el, index) => {
      result.writeInt32LE(el, index * 4)
    })
  
    return result.toString('hex')
    */
}
exports.generateRandomID = generateRandomID;
