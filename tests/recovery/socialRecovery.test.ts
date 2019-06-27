import { SocialRecovery } from '../../ts/recovery/socialRecovery'
import { expect } from 'chai'

const testSecret =
  'a2985156e3da3046101ae2b26093f647fed9d6ce31ffeb4d975d143ac69e5b46'
const testDID =
  'e76fb4b4900e43891f613066b9afca366c6d22f7d87fc9f78a91515be24dfb21'

const testShares = [
  '80167ac660ce59ddf5a41a77edb03f1ef3a1f23219253a6f21143ff937fdc00368403a6929b0374e5228c993fc414cc85b0eb95ce44264026a8a7cbef098a77fa05cddd4eb11f1345ffdc48d3fb7d52e354',
  '8028410f779acbe766199a42206df816ec9f0e41b97b19b5fb641d18c980f98599b3fc42e7adbd2ee899d61ac482aa4f062200b00537ab2573755fefa191edeb299e9440a6ffb6a7df98149714897dbec67',
  '803e3bc91754923a93bd8035cdddc7081f208a88eb17233ee2e1d4f2f816a37a529500f9e1600d9c25c9b69c2d7dc258ef369069f41bf2841d9e22ff7a2f43abedbda409210d586d34bca5cb6892c175475',
  '80420691f6bb43f9fb143ae1b82e0fa524e0628ad53007eeabf1c62ee90250c3406c4aae3b944ee6608c8cb32bd8b7d164afbbd26d8f413cf5e42bedade7a531393099090f0da95a12b818d214d8c336710',
  '80547c5796751a240eb02096559e30bbd75fe643875c3d65b2740fc4d8940a3c8b4ab6153d59fe54addcec35c227dfc68dbb2b0b9ca3189d9b0f56fd76590b71fd13a94088ff4790f99ca98e68c37ffdf02',
]
describe('Social Recovery', () => {
  it('should create and combine', function() {
    const shards = 255
    const threshold = 50
    const horcruxes = SocialRecovery.createHorcruxes(
      testDID,
      testSecret,
      shards,
      threshold,
    )

    const { did, secret } = SocialRecovery.combineHorcurxes(
      horcruxes.slice(0, threshold),
    )
    expect(secret).to.equal(testSecret)
    expect(did).to.equal(testDID)
  })

  it('should create shares correctly', () => {
    const horcruxes = SocialRecovery.createHorcruxes(testDID, testSecret, 5, 3)
    console.log(horcruxes)
    expect(horcruxes.length).to.equal(5)
  })

  it('should combine shares correctly', () => {
    const { did, secret } = SocialRecovery.combineHorcurxes(
      testShares.slice(0, 3),
    )
    expect(secret).to.equal(testSecret)
    expect(did).to.equal(testDID)
  })

  it('should fail if not enough shares are presented', () => {
    const result = SocialRecovery.combineHorcurxes([
      testShares[0],
      testShares[1],
    ])
    expect(result.secret).to.not.equal(testSecret)
    expect(result.did).to.not.equal(testDID)
  })
})
