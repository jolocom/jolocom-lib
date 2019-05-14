import { SocialRecovery } from '../../ts/recovery/socialRecovery'
import { expect } from 'chai'

const testSecret = '9b5d21c8b94be782884ffcc7c26bcacc'
const testShares = [
  '8012e92fbddb9f75543261d7a173c46169ce93af16884fd7702b5dc3e91e18c1bd3',
  '802a796039e5f80c81e9acc04308bfefcdaad389e91446680629af312295c7a0306',
  '8038904f843e6779d5dbcd17e27b7b8ea47df5f4e3179d010e2a760d07f7f9dd219',
  '80498b781c57ecc1866567aef18e034827d98014a6a787c5c8c110cfc13a46680b2',
  '805b6257a18c73b4d257067950fdc7294e0ea669aca45cacc0c2c9f3e45878151ad',
]

describe('Social Recovery', () => {
  it('should create and combine', function() {
    const shards = 255
    const threshold = 50
    const horcruxes = SocialRecovery.createHorcruxes(
      testSecret,
      shards,
      threshold,
    )
    const secret = SocialRecovery.combineHorcurxes(
      horcruxes.slice(0, threshold),
    )
    expect(testSecret).to.equal(secret)
  })

  it('should create shares correctly', () => {
    const horcruxes = SocialRecovery.createHorcruxes(testSecret, 5, 3)

    expect(horcruxes.length).to.equal(5)
  })

  it('should combine shares correctly', () => {
    const secret = SocialRecovery.combineHorcurxes(testShares.slice(0, 3))
    expect(secret).to.equal(testSecret)
  })

  it('should fail if not enough shares are presented', () => {
    const secret = SocialRecovery.combineHorcurxes([
      testShares[0],
      testShares[1],
    ])
    expect(secret).to.not.equal(testSecret)
  })
})
