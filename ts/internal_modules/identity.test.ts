import * as bs58 from 'bs58'
import { expect } from 'chai'
import DID from './identity'

describe('DID', () => {
  it('Should correctly instantiate a DID class from user public key', () => {
    const keyString = '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442'
    const publicKey = Buffer.from(keyString, 'utf8')
    const did = new DID(publicKey)
    const decoded = bs58.decode(did.identifier.slice(9))
    const did2 = new DID(decoded)
    expect(did.identifier).to.be.a('string')
    expect(did.identifier).to.equal(did2.identifier)
  })
})

/*

new DID()

DID.verifySignedMessage
DID.signMessage
DID.getKeyPairOfSigningKey(?)
DID.encryptMessage(?)
DID.decryptMessage(?)
DID.findVerifications(?)

it should produce a DID bound to the user's XXX public key

*/
