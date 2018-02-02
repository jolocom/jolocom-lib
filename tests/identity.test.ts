import { expect } from 'chai'
import testData from './data/identity'
import Identity from '../ts/identity'
import IdentityConfig from '../ts/identityConfig'
import * as lolex from 'lolex'

describe('Identity', () => {
  const config = {
    providerUrl: "dsafd",
    ethereumAddress: "fegbrwef32rfedca"
  }

  it('Should initialize Identity class with a correct config', () => {
    expect(Identity.initialize(config).config).to.deep.equal(config)
  })

  it('Should return mnemonic, master key, generic signing key and ethereum key in WIF', () => {
    const identity = Identity.create(testData.randomStringFromEntropy)

    expect(identity).to.deep.equal({
      ethereumKeyWIF: "L17covSN3DaequjaB8GBYYNnza8nNvgiyJtspVdC7SVrdkLRmGU8",
      genericSigningKeyWIF: "KzxmDGkhpYSUQNaYAZxQWMCffre9WSRiGxHxoGmCLUbJksxjc7jU",
      masterKeyWIF: "L2y7adEkWadF2QBjxs9M2R7rqM1XbcAvdB5rcEJUG3kvACLZnGP4",
      mnemonic: "bean matrix move giraffe island depth canal time air divorce town duck",
    })
  })
})
