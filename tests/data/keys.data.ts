/*
 * Key related information for testing signing / verification / authentication functionality
 * The mock Eth and Identity keys have been derived form the mock test seed and are valid
 * child keys
 */

export const testSeed = Buffer.from(
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'hex',
)

//corresponds to testSeed
export const testMnemonic =
  'primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary fetch primary foster'

export const testPrivateIdentityKey = Buffer.from(
  '38a2eb228140a343696431939eedc14b937b0041872541df095c1b266fb55aea',
  'hex',
)

export const testPublicKey = Buffer.from(
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
  'hex',
)

export const testPrivateKey = Buffer.from(
  '38a2eb228140a343696431939eedc14b937b0041872541df095c1b266fb55aea',
  'hex',
)

/* Invalid keys for testing signing / verifications. */

export const testIncorrectPublicIdentityKey = Buffer.from(
  '03848af62bffceb57631789ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
  'hex',
)
