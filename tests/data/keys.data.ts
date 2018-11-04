/* 
 * Key related information for testing signing / verification / authentication functionality
 * The mock Eth and Identity keys have been derived form the mock test seed and are valid
 * child keys
 */

export const testSeed = Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex')

export const testPrivateIdentityKey = Buffer.from(
  '38a2eb228140a343696431939eedc14b937b0041872541df095c1b266fb55aea',
  'hex'
)

export const testPublicIdentityKey = Buffer.from(
  '03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
  'hex'
)

export const testPrivateEthereumKey = Buffer.from(
  '204878ffe22c92f4aa7714aba37d6c0dcc43c45f67205b161b73c78e21dbf512<Paste>',
  'hex'
)

/* Invalid keys for testing signing / verifications. */

export const testIncorrectPublicIdentityKey = Buffer.from(
  '03848af62bffceb57631789ac0e0726106ee1c23262d6fd7ef906559d68f53a551',
  'hex'
)

/* Keys used in integration test */

export const testPrivateIdentityKey3 = Buffer.from(
  'a8736629c00011bc18b226eb0ce274c37d6042641eac768b5a4352227affda0e',
  'hex'
)

export const testPublicIdentityKey3 = Buffer.from(
  '036b3dd49a48ee790646014ba4e98664dd328097710ac02bbe8e3a0e9bc824a8ca',
  'hex'
)

export const testPrivateEthereumKey3 = Buffer.from(
  'ae084ea439ae5eecdccbf43b188567bbf23adfd11928fb6268071225048140bc',
  'hex'
)
