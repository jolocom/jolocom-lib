import * as chai from 'chai'
import * as sinon from 'sinon'
import { JoloDidMethod } from '../../../ts/didMethods/jolo'
import { didDocumentJSON, mockDid } from '../../data/didDocument.data'
import { Identity } from '../../../ts/identity/identity'
import { DidDocument } from '../../../ts/identity/didDocument/didDocument'

const expect = chai.expect

describe('Jolo Did Method, bip39 recovery', async () => {
  const didMethod = new JoloDidMethod()
  didMethod.resolver.resolve = sinon.stub().resolves(
    Identity.fromDidDocument({
      didDocument: DidDocument.fromJSON(didDocumentJSON)
    })
  )

  it('Should correctly derive keys / incept an identity given a seed', async () => {
    const testSeed = Buffer.from('a'.repeat(64), 'hex')
    const recoveredIdentity = await didMethod.recoverFromSeed(testSeed, 'pass')

    expect(recoveredIdentity.did).to.eq(mockDid)

    expect(recoveredIdentity.didDocument.publicKey.length).to.eq(1)
    expect(recoveredIdentity.identity.publicKeySection[0].toJSON()).to.deep.eq({
      controller: mockDid,
      id: `${mockDid}#keys-1`,
      publicKeyHex: "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551",
      type: "EcdsaSecp256k1VerificationKey2019"
    })
  })
})


