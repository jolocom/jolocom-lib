import { SocialRecovery } from '../../ts/recovery/socialRecovery'
import { expect } from 'chai'

const testSecret =
  'a2985156e3da3046101ae2b26093f647fed9d6ce31ffeb4d975d143ac69e5b46'
const testDID =
  'e76fb4b4900e43891f613066b9afca366c6d22f7d87fc9f78a91515be24dfb21'

const testShares = [
  '801Bs7NxYYUOu902r0qC64BLrPCQihc78jbsBGdssJ0G+lZ9nDApib/HBIh8YDTfj462Si/VGdqKmIExvUAsT3f/9KcveJEOmhwiUS62hrvRNL0GylfO5MCj+AjKbAkmHV6SAeZDFodHUKA4mqJubYRKiUcnmGhO+bWHKKL3bjTVx7qtTXU6K70ebUUhuymcGz569LxblqiV9KCxNTyaXpqM2d15Tj9zjUHiBvJAFvtvTadXuZ7VNu/KE7iu4M9StQzsTeLg9eZSEly2FxsJATDloR8EMeDcLTa6hJgLJTPeaf/9D4Z3zzHahpeUHIwwVd+3pcgFggvpwYOzB3TYyGEjTJ0pyirQgt9dD082+AGct3b4KYCEc/jMNoX0JEfJN0J',
  '802bwJy/Rhwr0jm0U7OZXxGm04QJms4+s1NUsKLrFVKcD6EBbUNCnY1eYGNc9Wk89Hh4VzAG/M6RndawfVWQKVCcfw0WAELYcm7dfAmoh3nF9NnUbe00vrZ0l5Lspr+qrx8WdHRIKsuNIuRNWMwKAxNOJkOV56oiDvih7wDUlz1JyY5TiUfGnbCuBVBbFkU8VxXM9qHt5/3Rfo8+clXLuLC9zUyxvOXN1qmi30RXwZ3kE6ehsghfCMvxoj2ms4sqxnA4hxy2RMSA8v++euQDt1tE//0iHg1eL/7QJHlUtDvgMb11xprhO2S9h3TSZC7MSbS/Vmtj023tdG9/U6qeBamH42Shm1QikQwNGydJ/3TWUzwAQd9HZd+Sy5YgiypCOed',
  '803ac3WuVt41ZAETDbnS2xejxXeZB5kNwWn4uEWfJdYa7Pdx8X/rDXKB5OZgmR3uO/qOE1/LpRobCJeYQBv8fud6C6f5dtPP6H8/NKcSgc6U2WTfJ6I6V/ba75bm0vaUclgEbdIFfFRKf8R4QmJkYlcI7wkyZkJgt0NmyaIvOQScF3TyxD78uE29aA36oGy4zDI2D527sUwEgq+ER2HR66o8FIlI/5qnG+YA1DYPF37LUsD7C5rKJyQ28YjIXQRhc3HU0n5P8TtS+SMELfPKryu5nu+mNu2MQtFquaFGEQX+VUKFSQUW+JVpQe9GdSLwnHOI/yN/EX5EuazAVNIGwEipr/WIXb7qU8pQGKhmR3jK6Qr0KFKDGCdQvR9Uty2DjrP',
  '804Tz16jhMp76boiD/C1YgGe/l6/mZK7ponGC2BMr0e5bnNzD5zZS0V77Ei7LIp+TGz+vIr1Q+exDjh+v+TfAcnqOwMTDAgsOs6HzhtZp5QaCi8DMBWE+X89Yq+3ocDZCDasfFg2jcIUBg10iCRUe0730Tra3S20Pny1aMmS3zjUA2VdWuhT0pFab8/Mckhv5JMoRfu4o9YARvs+2LPi67BvKEn1fPupXSxKeRg1PYBxgj/yOk7j3pzzV1tyogdkbgOl+kdqZzocMqJoJocGf0lpWzql13S0GyYnvhDtA5OyM6vFLGXibU9A54XEd8g81YFihTUnPPlyO7ZF1EPMk6nb4TBYjLMJN1JP5yUbWfPfC2MV0s9xhZSQHpm5QEp7s5f',
  '805SfLeylAhlX4KFUfr+5geb6K0vBMWI1LNqA4c4n8M/jSUDk6Bw27qkaM2HQP6sg+4I+OU4GjM7m3lWgqqzVn4MT6n8epk7oN9lhrXjoSNLJ5IIelqKED+TGqu91Ynn1XG+Zf57213TWy1Bkoo6GgqxGHB9XMX2h8dyTmtpcQEB3Z/8F5Fp92xJApJtxGHrf7TSvMfu9WfVutuE7Yf4uKru8YwMP4TDkGPocmpt62New1iog9x28XM0BO4cTIgv2wJJryWT0sXOOX7ScZDPZzmUOigh/5RmdgmdI8j/pq2sV1Q1o/oVrr6UIR5QZsQAAEZVLH07/urb9nX60ztUVkj1raFxSlnB9ZQS5Ko04f/DsVXhu0K1+GxSaBDNfE26BMN',
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
    expect(() => SocialRecovery.combineHorcurxes([
      testShares[0],
      testShares[1],
    ])).to.throw()
  })

  it('should validate a shard', () => {
    const result = SocialRecovery.validateHorcrux(testShares[0])
    expect(result).to.be.true
  })
})
