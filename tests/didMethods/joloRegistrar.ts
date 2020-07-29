// import * as sinon from 'sinon'
// import {
//   JolocomRegistry,
// } from '../../ts/registries/jolocomRegistry'
// import { DidDocument } from '../../ts/identity/didDocument/didDocument'
// import { Identity } from '../../ts/identity/identity'
// import { didDocumentJSON } from '../data/didDocument.data'
// import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
// import {
//   testSeed,
// } from '../data/keys.data'
// import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
// import { encryptionPass } from './jolocomRegistry.data'
// import { expect } from 'chai'
// 
// describe('Jolocom Registry - create', () => {
//   const sandbox = sinon.createSandbox()
// 
//   const mockVault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)
// 
//   before(async () => {
//     sandbox
//       .stub(DidDocument, 'fromPublicKey')
//       .returns(DidDocument.fromJSON(didDocumentJSON))
//   })
// 
//   after(() => {
//     sandbox.restore()
//   })
// 
//   it('should correctly call registrar and return new identity wallet', async () => {
//     const jolocomRegistry = new JolocomRegistry()
//     jolocomRegistry.registrar.create = async () =>
//       Identity.fromDidDocument({
//         didDocument: DidDocument.fromJSON(didDocumentJSON)
//       })
// 
//     const identityWallet = await jolocomRegistry.create(
//       mockVault,
//       encryptionPass
//     )
// 
//     expect(identityWallet.didDocument.toJSON()).to.deep.eq(didDocumentJSON)
//   })
// })
// import * as sinon from 'sinon'
// import * as chai from 'chai'
// import * as sinonChai from 'sinon-chai'
// 
// chai.use(sinonChai)
// 
// describe('Jolocom registry - commit', () => {
// 
//   it('should commit without public profile', async () => {
//   })
// 
//   it('should commit with local public profile, and no remote', async () => {
//   })
// 
//   it('should commit with updated public profile', async () => {
//   })
// 
//   it('should commit with removed public profile', async () => {
//   })
// 
//   it('should correctly throw', async () => {
//   })
// })
