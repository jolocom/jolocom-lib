// import * as sinon from 'sinon'
// import {
//   JolocomRegistry,
// } from '../../ts/registries/jolocomRegistry'
// import { Identity } from '../../ts/identity/identity'
// import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
// import { testPublicIdentityKey, testSeed } from '../data/keys.data'
// import { encryptionPass, keyMetadata } from './jolocomRegistry.data'
// import { mockDid, didDocumentJSON } from '../data/didDocument.data'
// import { expect } from 'chai'
// import { DidDocument } from '../../ts/identity/didDocument/didDocument'
//
// describe('Jolocom Registry - authenticate', () => {
//   const sandbox = sinon.createSandbox()
//
//   const mockDidDoc = DidDocument.fromJSON(didDocumentJSON)
//   const mockVault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)
//   const registry = new JolocomRegistry()
//
//   before(async () => {
//     sandbox.stub(mockVault, 'getPublicKey').returns(testPublicIdentityKey)
//     sandbox
//       .stub(JolocomRegistry.prototype, 'resolve')
//       .resolves(Identity.fromDidDocument({ didDocument: mockDidDoc }))
//     sandbox.stub(Identity.prototype, 'publicKeySection').returns([
//       {
//         getIdentifier: sinon.stub(),
//       },
//     ])
//   })
//
//   after(() => {
//     sandbox.restore()
//   })
//
//   it('should correctly authenticate', async () => {
//     const iw = await registry.authenticate(mockVault, keyMetadata.encryptionPass)
//     sandbox.assert.calledWith(mockVault.getPublicKey, keyMetadata)
//     sandbox.assert.calledWith(JolocomRegistry.prototype.resolve, mockDid)
//     expect(iw.didDocument.toJSON()).to.deep.eq(didDocumentJSON)
//   })
// })
