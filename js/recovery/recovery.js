"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bip39_1 = require("bip39");
const socialRecovery_1 = require("./socialRecovery");
exports.SEED_PHRASE_LENGTH_LIST = [12, 15, 18, 21, 24];
function sliceSeedPhrase(seedPhrase) {
    const seedPhraseArray = seedPhrase.split(' ');
    const divideAt = exports.SEED_PHRASE_LENGTH_LIST.find(l => bip39_1.validateMnemonic(seedPhraseArray.slice(0, l).join(' ')));
    const firstEncodedValue = seedPhraseArray.slice(0, divideAt);
    const secondEncodedValue = seedPhraseArray.slice(divideAt);
    return {
        seed: bip39_1.mnemonicToEntropy(firstEncodedValue.join(' ')),
        encodedDid: secondEncodedValue.length &&
            bip39_1.mnemonicToEntropy(secondEncodedValue.join(' ')),
    };
}
exports.sliceSeedPhrase = sliceSeedPhrase;
exports.shardsToMnemonic = async (shards) => {
    const { did, secret } = socialRecovery_1.SocialRecovery.combineShard(shards);
    return {
        didPhrase: bip39_1.entropyToMnemonic(Buffer.from(did, 'hex')),
        seed: bip39_1.entropyToMnemonic(secret),
    };
};
//# sourceMappingURL=recovery.js.map