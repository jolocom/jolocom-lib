import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('Software Vaulted Key Provider', () => {

  describe('constructor', () => {
    it('Should correctly instantiate given entropy and password')
    it('Should fail to instantiate if entropy is invalid')
    it('Should fail to instantiate if entropy or password are missing')
  })

  describe('getPublicKey', () => {
    it('Should correctly derive public key given path and pasword')
    it('Should fail if path or password are missing')
  })

  describe('getRandom', () => {
    it('Should correctly call the temporary crypto.randomBytes')
  })

  describe('sign', () => {
    it('Should correctly compute signature given digest and key data')
    it('Should fail to compute signature if digest or key data are invalid')
  })

  describe('verify', () => {
    it('Should correctly validate signature given digest signature, and public key')
    it('Should correctly detect invalid signature')
    it('Should throw given invalid input')
  })

  describe('getPrivateKey', () => {
    it('Should correctly derive public key given path and pasword')
    it('Should fail if path or password are missing')
  })

  describe('signDigestable', () => {
    it('Should correctly digest passed object and call compute signature')
    it('Should fail to compute signature if object or key data is invalid')
  })

  describe('validateDigestable', () => {
    it('Should correctly digest passed object and validate the signature')
    it('Should correctly detect invalid signature')
    it('Should throw given invalid input')
  })
})