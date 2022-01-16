import * as chai from 'chai'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'
import {
  testDidDoc0,
  testDidDoc1,
  testDidDoc2,
  testDidDoc3,
} from './testVectors/didDocumentTestData'
import {
  signedCredTestVector0,
  signedCredTestVector1,
  signedCredTestVector2,
} from './testVectors/signedCredentialData'
import { signedJWTTestVector0, signedJWTTestVector1 } from './testVectors/signedJwtTestData'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { SignedCredential } from '../../ts/credentials/outdated/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'

chai.use(require("sinon-chai"))
const expect = chai.expect

// TODO Add vectors
// TODO Add fixture from less popular formats

describe('parseAndValidate', () => {
  describe('Jolo DidDocuments', async () => {
    it('Should correctly parse and validate older versions of our DID Documents', async () => {
      expect(await parseAndValidate.didDocument(testDidDoc0)).instanceOf(
        DidDocument,
      )
      expect(await parseAndValidate.didDocument(testDidDoc1)).instanceOf(
        DidDocument,
      )
      expect(await parseAndValidate.didDocument(testDidDoc2)).instanceOf(
        DidDocument,
      )
    })
    // TODO Add JUN fixture
    it('Should correctly parse and validate current versions of our DID Documents', async () => {
      //@ts-ignore Context is a number, does not assign to context entry
      expect(await parseAndValidate.didDocument(testDidDoc3)).instanceOf(
        DidDocument,
      )
    })
  })

  describe('Signed Credentials', async () => {
    it('Should correctly throw if signer is incorrect', async () => {
      const identity = Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(signedCredTestVector0.signerDidDoc),
      })

      return expect(
        await parseAndValidate.signedCredential(
          signedCredTestVector1.signedCredential,
          identity,
        ).catch(_ => false),
      ).to.eq(false)
    })

    it('lib@4.0.2 Should correctly parse and validate credentials', async () => {
      const identity = Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(signedCredTestVector0.signerDidDoc),
      })
      expect(
        await parseAndValidate.signedCredential(
          signedCredTestVector0.signedCredential,
          identity,
        ),
      ).instanceOf(SignedCredential)
    })
    it('lib@5.0 Should correctly parse and validate credentials created by JUN identities', async () => {
      const identity = Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(signedCredTestVector1.signerDidDoc),
      })
      expect(
        await parseAndValidate.signedCredential(
          signedCredTestVector1.signedCredential,
          identity,
        ),
      ).instanceOf(SignedCredential)
    })
    it('lib@5.0 Should correctly parse and validate credentials created by JOLO identities', async () => {
      const identity = Identity.fromDidDocument({
        //@ts-ignore the version in context is a nr, as opposed to the types in ContextEntry
        didDocument: DidDocument.fromJSON(signedCredTestVector2.signerDidDoc),
      })
      expect(
        await parseAndValidate.signedCredential(
          signedCredTestVector2.signedCredential,
          identity,
        ),
      ).instanceOf(SignedCredential)
    })
  })

  describe('JSON Web Tokens', async () => {
    it('Should correctly throw if signer is incorrect', async () => {
      const identity = Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(signedJWTTestVector1.signerDidDoc),
      })

      return expect(
        await parseAndValidate.interactionToken(
          signedJWTTestVector0.signedJWT,
          identity,
        ).catch(_ => false),
      ).to.eq(false)
    })

    it('lib@5 Should correctly parse and validate JWT created by jolo identity', async () => {
      const signer = Identity.fromDidDocument({
        //@ts-ignore version is a number, not compatible with our ContextEntry type
        didDocument: DidDocument.fromJSON(signedJWTTestVector0.signerDidDoc),
      })
      expect(
        await parseAndValidate.interactionToken(
          signedJWTTestVector0.signedJWT,
          signer,
        ),
      ).instanceOf(JSONWebToken)
    })

    it('lib@5.0 Should correctly parse and validate JWT created by JUN identities', async () => {
      //@ts-ignore version is a number, not compatible with our ContextEntry type
      const signer = Identity.fromDidDocument({
        didDocument: DidDocument.fromJSON(signedJWTTestVector1.signerDidDoc),
      })
      expect(
        await parseAndValidate.interactionToken(
          signedJWTTestVector1.signedJWT,
          signer,
        ),
      ).instanceOf(JSONWebToken)
    })


    it('lib@4.0.2 Should correctly parse and validate JWTs created by JOLO identities', async () => {})
  })
})
