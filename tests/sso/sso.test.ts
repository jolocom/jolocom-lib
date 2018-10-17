import { SSO } from '../../ts/sso/'
import * as chai from 'chai'
const expect = chai.expect

describe('SSO class', () => {

  describe('JWTtoQR', () => {
    const jwtString = 'ajfknvjgaknkltrgm;laref,el;fced'
    const sso = new SSO()

    it('should allow to skip options param', async () => {
      expect(await sso.JWTtoQR(jwtString)).to.contain('data:image/png')
    })
  })
})
