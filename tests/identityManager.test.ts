import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IdentityManager } from '../ts/identityManager/identityManager'
chai.use(sinonChai)
const expect = chai.expect

describe('IdentityManager', () => {
  const testSeed = Buffer.from('316AF5B648D7E1DF31B73729E8E6628AEB8060CC4389C2B2A81BD56E92E9228D', 'hex')
  const identityManager = IdentityManager.create({seed: testSeed})

  describe('static create', () => {
    it('should create an instance of IdentityManager with correct default keys schema', () => {
      const keySchema = identityManager.getSchema()

      expect(keySchema).to.have.property('jolocomIdentityKey')
      expect(keySchema).to.have.property('ethereumKey')
      expect(keySchema.jolocomIdentityKey).to.equal('m/73\'/0\'/0\'/0')
      expect(keySchema.ethereumKey).to.equal('m/44\'/60\'/0\'/0/0')
    })
  })

  describe('deriveChildKeys', () => {
    it('should return a correct child key according to path', () => {
      const keySchema = identityManager.getSchema()
      const childKeys = identityManager.deriveChildKeys({path: keySchema.jolocomIdentityKey})

      expect(childKeys.path).to.be.equal(keySchema.jolocomIdentityKey)
    })
  })

  describe('getSchema', () => {
    it('should return the schema object', () => {
      const mockKeySchema = {
        jolocomIdentityKey: 'm/73\'/0\'/0\'/0',
        ethereumKey: 'm/44\'/60\'/0\'/0/0'
      }
      const keySchema = identityManager.getSchema()
      expect(keySchema).to.deep.equal(mockKeySchema)
    })
  })

  describe('addSchemaEntry', () => {
    it('should correctly add a new key schema entry to schema', () => {
      identityManager.addSchemaEntry({name: 'gov', path: 'm/73\'/0\'/0\'/1'})
      const keySchema = identityManager.getSchema()

      expect(keySchema).to.have.property('gov')
      expect(keySchema.gov).to.equal('m/73\'/0\'/0\'/1')
    })
  })
})
