import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { mockDid } from '../data/didDocument.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { LocalDidMethod } from '../../ts/didMethods/local/index'
import { SupportedJWA } from '../../ts/interactionTokens/types'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'
import { JolocomRegistrar } from '../../ts/didMethods/jolo/registrar'
import { authAsIdentityFromKeyProvider } from '../../ts/didMethods/utils'
import { recoverJoloKeyProviderFromSeed } from '../../ts/didMethods/jolo/recovery'
import { walletUtils } from '@jolocom/native-core'

chai.use(sinonChai)
const expect = chai.expect

const TEST_SEED = Buffer.from('a'.repeat(64), 'hex')
const TEST_PASS = 'secret'

const JUN_DID_64A = 'did:jun:Er9pmwbXpDOd_Vp46jVJUrZGjW-ujSXeoobGS77z2_Po'
const JOLO_DID_64A = mockDid

describe('IdentityWallet', () => {
  describe('Correctly sets relevant metadata describing the signature type', () => {
    describe('JOLO identity, using EcDSA secp256k1', async () => {
      const vkp = await recoverJoloKeyProviderFromSeed(
        TEST_SEED,
        TEST_PASS,
        walletUtils
      )

      const identityWallet = await authAsIdentityFromKeyProvider(
        vkp,
        TEST_PASS,
        await new JolocomRegistrar().didDocumentFromKeyProvider(vkp, TEST_PASS)
      )

      it('Should correctly set ALG when creating and signing JWTs', async () => {
        const jwt = await identityWallet.create.interactionTokens.request.auth({
          callbackURL: 'https://test.ts'
        }, TEST_PASS)

        expect(jwt.header.typ).to.eq("JWT")
        expect(jwt.header.alg).to.eq(SupportedJWA.ES256K)

        expect(identityWallet.did).to.eq(JOLO_DID_64A)

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
          TEST_PASS
        )

      it('Should correctly set ALG when creating and signing JWTs', async () => {
        const jwt = await identityWallet.create.interactionTokens.request.auth({
          callbackURL: 'https://test.ts'
        }, TEST_PASS)

        expect(jwt.header.typ).to.eq("JWT")
        expect(jwt.header.alg).to.eq(SupportedJWA.EdDSA)

        expect(identityWallet.did).to.eq(JUN_DID_64A)
        return expect(await parseAndValidate.interactionToken(
          jwt.encode(),
          identityWallet.identity
        )).instanceOf(JSONWebToken)
      })
    })
  })
})
