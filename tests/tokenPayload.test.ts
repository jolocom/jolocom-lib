import { expect } from 'chai'
import TokenPayload from '../ts/sso/tokenPayload'
import testAuth from './data/authentication'

describe('Token payload', () => {
  const tokenPayload = new TokenPayload({
    iss: testAuth.mockDIDISS,
    pubKeyIss: testAuth.rawPublicKey,
    reqClaims: ['name', 'proofOfAge']
  })

  it('should correctly instantiate a TokenPayload class', () => {
    expect(tokenPayload).to.have.property('iss')
    expect(tokenPayload).to.have.property('iat')
    expect(tokenPayload).to.have.property('exp')
    expect(tokenPayload).to.have.property('jti')
    expect(tokenPayload).to.have.property('pubKeyIss')
    expect(tokenPayload.jti).to.be.a('string')
  })

  it('should correctly assemble response token payload', () => {
    const token = {
      hader: 'lalala',
      payload: tokenPayload,
      sig: 'jehbrkegnj'
    }

    const resTokenPayload = TokenPayload.generateResponse({
      tokenData: token,
      sub: testAuth.mockDIDSUB,
      pubKeySub: testAuth.rawPublicKey
    })

    console.log(resTokenPayload)
    expect(resTokenPayload.iss).to.equal(tokenPayload.iss)
    expect(resTokenPayload.jti).to.equal(tokenPayload.jti)
    expect(resTokenPayload.pubKeyIss).to.equal(tokenPayload.pubKeyIss)
    expect(resTokenPayload.sub).to.equal(testAuth.mockDIDSUB)
  })
})
