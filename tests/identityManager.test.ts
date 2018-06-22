import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as testKeys from './data/keys'
import { IdentityManager } from '../ts/identityManager/identityManager'
import { keyTypes } from '../ts/index'

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityManager', () => {
  const identityManager = IdentityManager.create(testKeys.testSeed)

  describe('static create', () => {
    it('should create an instance of IdentityManager with correct default keys schema', () => {
      const keySchema = identityManager.getSchema()

      expect(keySchema.jolocomIdentityKey).to.equal(keyTypes.jolocomIdentityKey)
      expect(keySchema.ethereumKey).to.equal(keyTypes.ethereumKey)
    })
  })

  describe('deriveChildKeys', () => {
    it('should return a correct child key according to path', () => {
      const keySchema = identityManager.getSchema()
      const childKey = identityManager.deriveChildKey(keySchema.jolocomIdentityKey)

      expect(childKey.path).to.be.equal(keySchema.jolocomIdentityKey)
    })
  })

  describe('getSchema', () => {
    it('should return the schema object', () => {
      const keySchema = identityManager.getSchema()

      expect(keySchema).to.deep.equal(keyTypes)
    })
  })

  describe('addSchemaEntry', () => {
    it('should correctly add a new key schema entry to schema', () => {
      identityManager.addSchemaEntry({name: 'gov', path: 'm/73\'/0\'/0\'/1'})
      const keySchema = identityManager.getSchema()

      expect(keySchema.gov).to.equal('m/73\'/0\'/0\'/1')
    })
  })
})
