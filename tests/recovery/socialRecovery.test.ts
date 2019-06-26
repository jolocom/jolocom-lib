import { SocialRecovery } from '../../ts/recovery/socialRecovery'
import { expect } from 'chai'

const testSecret =
  'a2985156e3da3046101ae2b26093f647fed9d6ce31ffeb4d975d143ac69e5b46'
const testDID =
  'e76fb4b4900e43891f613066b9afca366c6d22f7d87fc9f78a91515be24dfb21'

const testShares = [
  '80126e7815338eb7fa575b91f46ea0dd8f9c1ce97fad1afe3874f44584701a02ca157766390b38c7a7a5e68495d30b891b55b674c51fa9d37e39508db8ca20545595d03aade503400cfdfb43ac3918061d706e11fa54803474905d16c4078b024df89eee9eab46b83d536a01a4b38affa263bf9c783d63f9a8ec6fc52c5c261feb8f2c5ebddea44592c6f3393ab513a4058d060c5c0c41cfc4d8a3f329a6360cea3401277a63ea5c2ad8e3c1fab851ff9e5c66b688b93e3a6e1f45aca4bc0faba680301108bba1c2d23e71442466d9efa20b184f842763351ec3eecd23168af420c053bcc0cd075d103a07df8625e0e9f590ab8c2d3b66fdc3c1e121638c73d959ded779a3bd1471437087c50e0b9f58d91',
  '802b724e4894c91f5ccefdd213fcc72e9bd3f9b98ce3897d46cadbc31488fe46fc11a3905b581f5a0d9c51b0b523c4540d2b36ca34e685ecb67b7ee865f55934c026da58419932c86ecec6ab98c8509669d90febbc6e4adcb893ceb1cabcaf5a4bde6406fd9617357a8fa91894480174ac316bafb1f3baccbb01f035dfc05a9311874ac1b08478a007bacb7c08cba9ec0089c3c6b6e42c4255fcfed3564f60ee79bfd45727c714cc94d10816d0a6bc65968d2db74ea6cf9a4f7b076aa5273db0d1a275907ef65616b454028a5d4159937a1127b4a55b8b4e41f9a511e070b205d19a7fefa8e0de6e873b7c764389f67bf33f002d4109f7497e98995f3b998c272a14d51c6648ccc065df8fb7b073709e83f',
  '80391c365da747a8a699a643e79267e3172fe610f56e90d378ee2c169398e2743014d7c66113248dac79b4642380cc4d103e83fef7d92a6fce222805de2f7a5093e30c52ef1c37c861a33ba832a14ef077d962ba455acc88cf3390370dbb27380506fcc8601d57dd41ccc00933fb889b0d32d773caceda0515fd99b0f0ac7adcf96865cf0e4adfb596fc3bd5315ebc5806a4c6dae9c86bad97445b607ca955c295dbd3505ef4fd80bd59e8c7298eeb8a0b514871c07ff230275444a602eb319b716246f1702df4f4654a758e7a47864cdb7a3c9b224cee6b590a4dbcc5763b61f77a2f336b4dda33943178b9c6cc10f205bfa8316fb29284be197e2e5b15fcfe705a0125c3d5dbf1208f0e12bd18ecb65cb',
  '804b8b31eb3684adbd3d7553e889156c21dc472bb19567a89108bcf5c800d0002c8de1d215cd012103d6e034803155061316f5bb70fee6c253c4926a5c99a79a7d7a1ea06c7f773331ee48e7c70c57a66bf775445c018e9827fa0fc0fea61c2c20c52ba64fc926183248b2ac1eafa6122b2b1115623643624963c9f794840d705d6e69751948c3ff20f906a562d09bb80a1a1ad0124ff466db5bc9733d0311056250e17ae72d6f6d28c64de8b773b435063a8bf4252991da65874fbc5b37916971dcae3924cfaa81295f676d3e731fe31d38d7c32d5200fd07a96f09a925dabf932ddd4084ce0ec8c33fc65d688af07295a4adf9cc3bc66fb80e1e0a061014eed0788550a84c9a1b4726adfbd6e13ed5657',
  '8059e549fe050a1a476a2ec21ce7b5a1ad205882c8187e06af2c4b204f10cc32e08895842f863af6a23305e016925d1f0e03408fb3c149412b9dc487e74384fe2ebfc8aac2fa72333e83b5e46d6549c075f71815a53508cc505a514639a1944e6e1db368d24266f0090bdbbdb91c2ffd8a28adc9190b23abe79fa072bbe82d3fb581467ba78664eab1bff60c5b458e0c0c371fcc4d63b38919e36cc017e524298e34e67d9e1e8621014ead394e5be3da9be6ee32abf0ac700da80c70fcfb9d42d11c9d582a140863f84110691975c03cbc53ccecaa4565d81f5a87a48c2353dbb5cd8d9c47630a95d035c292edcf16fb632405e5e280a3a2788ff97b669c64378a3651690dd18d2a02762c5edb8aa2fdba3',
]

describe('Social Recovery', () => {
  it('should create and combine', function() {
    const shards = 254
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
    expect(() =>
      SocialRecovery.combineHorcurxes([testShares[0], testShares[1]]),
    ).to.throw()
  })
})
