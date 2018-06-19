// import { expect } from 'chai'
// import { decodeToken } from 'jsontokens'
// import { SignedCredentialRequest } from '../../ts/credentialRequest/signedCredentialRequest/signedCredentialRequest'
// import { signedCredReqJson, signedCredReqJWT } from '../data/credentialRequest/signedCredentialRequest';

// describe('SignedCredentialRequest', () => {
//   it('Should implement static create method', () => {
//     const signedCR = SignedCredentialRequest.create(signedCredReqJson)
//     expect(signedCR.toJSON()).to.deep.equal(signedCredReqJson)
//   })

//   it('Should implement static fromJSON method', () => {
//     const signedCR = SignedCredentialRequest.fromJSON(signedCredReqJson)
//     expect(signedCR.toJSON()).to.deep.equal(signedCredReqJson)
//   })

//   it('Should implement toJSON method', () => {
//     const signedCR = SignedCredentialRequest.create(signedCredReqJson)
//     expect(signedCR.toJSON()).to.deep.equal(signedCredReqJson)
//   })

//   it('Should implement static fromJWT method', () => {
//     const signedCR = SignedCredentialRequest.fromJWT(signedCredReqJWT)
//     expect(signedCR.toJSON()).to.deep.equal(signedCredReqJson)
//   })

//   it('Should implement toJWT method', () => {
//     const signedCR = SignedCredentialRequest.fromJSON(signedCredReqJson)
//     const jwt = signedCR.toJWT()
//     expect(decodeToken(jwt)).to.deep.equal(signedCredReqJson)
//   })

//   it('Should implement all getter methods', () => {
//     const signedCR = SignedCredentialRequest.fromJSON(signedCredReqJson)
//     expect(signedCR.getCallbackURL()).to.equal(signedCredReqJson.payload.callbackURL)
//     expect(signedCR.getRequestedCredentialTypes().length).to.equal(2)
//     expect(signedCR.getRequestedCredentialTypes()).to.deep.equal([
//       ['Credential', 'ProofOfEmailCredential'],
//       ['Credential', 'ProofOfNameCredential']
//     ])
//   })

//   it('Should implement a validateSignature method', () => {
//     expect(false).to.equal(true)
//   })

//   it('Should implement an applyConstraints method', () => {
//     const signedCR = SignedCredentialRequest.create(signedCredReqJson)
//     // tslint:disable-next-line:no-unused-expression
//     expect(signedCR.applyConstraints).to.exist
//   })
// })
