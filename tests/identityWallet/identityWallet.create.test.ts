import * as chai from 'chai'
import { mockSeed, mockPass, mockJunDid, mockJoloDid } from '../data/didDocument.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { LocalDidMethod } from '../../ts/didMethods/local/index'
import { SupportedJWA } from '../../ts/interactionTokens/types'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'
import { JolocomRegistrar } from '../../ts/didMethods/jolo/registrar'
import { authAsIdentityFromKeyProvider } from '../../ts/didMethods/utils'
import { recoverJoloKeyProviderFromSeed } from '../../ts/didMethods/jolo/recovery'
import { walletUtils } from '@jolocom/native-core'

chai.use(require('sinon-chai'))
const expect = chai.expect

describe('IdentityWallet', () => {
  describe('Correctly sets relevant metadata describing the signature type', () => {
    describe('JOLO identity, using EcDSA secp256k1', async () => {
      const vkp = await recoverJoloKeyProviderFromSeed(
        mockSeed,
        mockPass,
        walletUtils
      )

      const identityWallet = await authAsIdentityFromKeyProvider(
        vkp,
        mockPass,
        await new JolocomRegistrar().didDocumentFromKeyProvider(vkp, mockPass)
      )

      it('Should correctly set ALG when creating and signing JWTs', async () => {
        const jwt = await identityWallet.create.interactionTokens.request.auth({
          callbackURL: 'https://test.ts'
        }, mockPass)

        expect(jwt.header.typ).to.eq("JWT")
        expect(jwt.header.alg).to.eq(SupportedJWA.ES256K)

        expect(identityWallet.did).to.eq(mockJoloDid)

        return expect(await parseAndValidate.interactionToken(
          jwt.encode(),
          identityWallet.identity
        )).instanceOf(JSONWebToken)
      })
    })

    describe('JUN identity, using EdDSA Ed25519', async () => {
      const { identityWallet } = await new LocalDidMethod()
        .recoverFromSeed(
          Buffer.from('a'.repeat(64), 'hex'),
          mockPass
        )

      it('Should correctly set ALG when creating and signing JWTs', async () => {
        const jwt = await identityWallet.create.interactionTokens.request.auth({
          callbackURL: 'https://test.ts'
        }, mockPass)

        expect(jwt.header.typ).to.eq("JWT")
        expect(jwt.header.alg).to.eq(SupportedJWA.EdDSA)

        expect(identityWallet.did).to.eq(mockJunDid)
        return expect(await parseAndValidate.interactionToken(
          jwt.encode(),
          identityWallet.identity
        )).instanceOf(JSONWebToken)
      })
    })
  })
})
