import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry, JolocomRegistry } from '../../ts/registries/jolocomRegistry'
import {
  integrationTestIpfsConfig,
  ethereumConfigProviderUrl,
} from '../data/interactionTokens/integrationTest.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { publicProfileCredJSON } from '../data/identity.data'
import { ADDRGETNETWORKPARAMS } from 'dns'
import { emailVerifiableCredential } from '../data/credential/signedCredential.data'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test', () => {
  let jolocomRegistry: JolocomRegistry
  let identityWallet: IdentityWallet
  const vault = new SoftwareKeyProvider(testSeed, 'pass')

  before(async function() {
    const ethereumConfig: IEthereumResolverConfig = {
      providerUrl: ethereumConfigProviderUrl,
      contractAddress: await integrationHelper.init()
    }

    jolocomRegistry = createJolocomRegistry({
      ipfsConnector: new IpfsStorageAgent(integrationTestIpfsConfig),
      ethereumConnector: new EthResolver(ethereumConfig)
    })
  })

  after(() => {
    process.exit(0)
  })

  it('correctly creates identities an identity', async () => {
    identityWallet = await jolocomRegistry.create(vault, 'pass')

    const resolvedIdentity = await jolocomRegistry.resolve(identityWallet.getDid())
    expect(resolvedIdentity.getDidDocument()).to.deep.eq(identityWallet.getDidDocument())
  })

  it('Should correctly add and commit public profile', async () => {
    const pubProf = SignedCredential.fromJSON(publicProfileCredJSON)
    identityWallet.getIdentity().publicProfile.set(pubProf)

    await jolocomRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet: identityWallet,
      keyMetadata: {
        derivationPath: KeyTypes.ethereumKey,
        encryptionPass: 'pass'
      }
    })

    const resolved = await jolocomRegistry.resolve(identityWallet.getDid())
    const pubKey = resolved.getPublicKeySection()[0].getPublicKeyHex()

    expect(await vault.verifyDigestable(Buffer.from(pubKey, 'hex'), resolved.getDidDocument()))
    expect(await vault.verifyDigestable(Buffer.from(pubKey, 'hex'), resolved.publicProfile.get()))

    expect(resolved.getDidDocument().toJSON()).to.deep.eq(identityWallet.getDidDocument().toJSON())
    expect(resolved.publicProfile.get()).to.deep.eq(identityWallet.getIdentity().publicProfile.get())
  })

  it('Should correctly update and commit public profile', async () => {
    const newPubProf = SignedCredential.fromJSON(emailVerifiableCredential)
    identityWallet.getIdentity().publicProfile.set(newPubProf)

    await jolocomRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet: identityWallet,
      keyMetadata: {
        derivationPath: KeyTypes.ethereumKey,
        encryptionPass: 'pass'
      }
    })

    const resolved = await jolocomRegistry.resolve(identityWallet.getDid())
    expect(resolved.publicProfile.get()).to.deep.eq(identityWallet.getIdentity().publicProfile.get())
  })

  it('Should correctly delete and commit public profile', async () => {
    identityWallet.getIdentity().publicProfile.delete()
    await jolocomRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet: identityWallet,
      keyMetadata: {
        derivationPath: KeyTypes.ethereumKey,
        encryptionPass: 'pass'
      }
    })

    const resolved = await jolocomRegistry.resolve(identityWallet.getDid())
    expect(resolved.publicProfile.get()).to.deep.eq(identityWallet.getIdentity().publicProfile.get())
  })
})
//   describe('SSO interaction flow', () => {
//     let identityWalletUser
//     let identityWalletService

//     before(async () => {
//       identityWalletUser = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey,
//         privateEthereumKey: testPrivateEthereumKey
//       })

//       identityWalletService = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey3,
//         privateEthereumKey: testPrivateEthereumKey3
//       })
//     })

//     let credRequestJWTClass
//     let credRequestJWT
//     let credResponseJWTClass
//     let credResponseJWT

//     it('should allow for simple generation of credential requests by service', async () => {
//       credRequestJWTClass = identityWalletService.create.credentialRequestJSONWebToken({
//         typ: InteractionType.CredentialRequest,
//         credentialRequest: sampleCredentialRequest
//       })

//       credRequestJWT = credRequestJWTClass.encode()

//       expect(credRequestJWTClass.getPayload()).to.be.an.instanceOf(CredentialRequestPayload)
//       expect(credRequestJWTClass.getPayload().credentialRequest)
//         .to.be.an.instanceOf(CredentialRequest)
//     })

//     it('should allow for simple consumption of signed credential requests by user', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credRequest = await JSONWebToken.decode(credRequestJWT)
//       sinon.restore()

//       const filteredCredentials = credRequest.applyConstraints([
//         testSignedCredentialIntegration, thirdMockCredential
//       ])

//       expect(credRequest).to.be.an.instanceOf(CredentialRequestPayload)
//       // tslint:disable
//       expect(credRequest.getCallbackURL()).to.exist
//       expect(credRequest.getRequestedCredentialTypes()).to.exist
//       expect(credRequest.applyConstraints).to.exist
//       // tslint:enable
//       expect(filteredCredentials).to.deep.equal([testSignedCredentialIntegration])
//     })

//     it('should allow for simple generation of appropriate credential response by user', async () => {
//       credResponseJWTClass = identityWalletUser.create.credentialResponseJSONWebToken({
//         typ: InteractionType.CredentialResponse,
//         credentialResponse: {
//           suppliedCredentials: [testSignedCredentialIntegration]
//         }
//       })

//       credResponseJWT = credResponseJWTClass.encode()

//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credRequest = await JSONWebToken.decode(credRequestJWT)
//       sinon.restore()

//       expect(credResponseJWTClass.getPayload()).to.be.an.instanceof(CredentialResponsePayload)
//       expect(credResponseJWTClass.getPayload().credentialResponse).to.be.an.instanceof(CredentialResponse)
//       expect(credResponseJWTClass.getPayload().getSuppliedCredentials()[0])
//         .to.be.an.instanceOf(SignedCredential)
//       // tslint:disable-next-line:no-unused-expression
//       expect(credResponseJWTClass.getPayload().credentialResponse
//         .satisfiesRequest(credRequest)).to.be.true
//     })

//     it('should validate signature of signed credential on credential response', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credResponse = await JSONWebToken.decode(credResponseJWT)
//       sinon.restore()

//       const suppliedCredentials = credResponse.getSuppliedCredentials()
//       const valid = await jolocomRegistry
//         .validateSignature(suppliedCredentials[0])
//       // tslint:disable-next-line:no-unused-expression
//       expect(valid).to.be.true
//     })
//   })

//   describe('Credential sharing flow ', () => {
//     let identityWalletUser
//     let identityWalletService

//     before(async () => {
//       identityWalletUser = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey,
//         privateEthereumKey: testPrivateEthereumKey
//       })

//       identityWalletService = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey3,
//         privateEthereumKey: testPrivateEthereumKey3
//       })
//     })

//     let authRequestJWTClass
//     let authRequestJWT
//     let authResponseJWTClass
//     let authResponseJWT

//     let credentialFromService
//     let credentialReceiveJWT

//     it('Should allow for simple generation of an authentication request by service', () => {
//       authRequestJWTClass = identityWalletService.create.authenticationJSONWebToken({
//         typ: InteractionType.Authentication,
//         authentication: {
//           challenge: 'jwnfoöwihvibvrjkn',
//           callbackURL: 'https://www.test.io/auth'
//         }
//       })
//       authRequestJWT = authRequestJWTClass.encode()

//       expect(authRequestJWTClass.getPayload()).to.be.an.instanceOf(AuthenticationPayload)
//       expect(authRequestJWTClass.getPayload().authentication).to.be.an.instanceOf(Authentication)
//     })
//     // tslint:disable-next-line
//     it('Should allow for simple consumption of authentication request and generate authentication response by user', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const authRequest = await JSONWebToken.decode(authRequestJWT)
//       sinon.restore()

//       authResponseJWTClass = identityWalletUser.create.authenticationJSONWebToken({
//         typ: InteractionType.Authentication,
//         authentication: authRequest.getAuthentication().toJSON()
//       })
//       authResponseJWT = authResponseJWTClass.encode()

//       expect(authRequest).to.be.an.instanceOf(AuthenticationPayload)
//       expect(authRequest.authentication).to.be.an.instanceOf(Authentication)
//       expect(authResponseJWTClass).to.be.instanceOf(JSONWebToken)
//     })
//     // tslint:disable-next-line
//     it('Should allow for authentication response consumption & validation and credentialsReceive creation by service', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const authResponse = await JSONWebToken.decode(authResponseJWT)
//       sinon.restore()

//       const validChallenge = authResponse.validateChallenge(authRequestJWTClass.getPayload())

//       if (!validChallenge) {
//         throw new Error('Challenge does not match requested challenge')
//       }

//       expect(authResponse).to.be.an.instanceOf(AuthenticationPayload)
//       // tslint:disable-next-line:no-unused-expression
//       expect(authResponse.validateChallenge).to.exist
//       // tslint:disable-next-line:no-unused-expression
//       expect(validChallenge).to.be.true

//       credentialFromService = await identityWalletService.create.signedCredential({
//         metadata: claimsMetadata.emailAddress,
//         claim: {
//           email: 'helloworld@test.com'
//         },
//         subject: authResponse.iss
//       })

//       const credReceiveJWTClass = identityWalletService.create.credentialsReceiveJSONWebToken({
//         typ: InteractionType.CredentialsReceive,
//         credentialsReceive: {
//           signedCredentials: [ credentialFromService ]
//         }
//       })

//       credentialReceiveJWT = credReceiveJWTClass.encode()

//       expect(credentialFromService).to.be.an.instanceOf(SignedCredential)
//       expect(credReceiveJWTClass).to.be.an.instanceOf(JSONWebToken)
//       expect(credReceiveJWTClass.getPayload()).to.be.an.instanceOf(CredentialsReceivePayload)
//     })

//     it('Should allow for consumption of credentialsReceieve with correct signed credential by user', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credReceive = await JSONWebToken.decode(credentialReceiveJWT)
//       sinon.restore()

//       const providedCredentials = credReceive.getSignedCredentials()
//       const validCredSignature = await jolocomRegistry
//         .validateSignature(providedCredentials[0])

//       expect(credReceive).to.be.an.instanceOf(CredentialsReceivePayload)
//       // tslint:disable-next-line:no-unused-expression
//       expect(credReceive.getSignedCredentials).to.exist
//       expect(providedCredentials[0]).to.be.an.instanceOf(SignedCredential)
//       // tslint:disable-next-line:no-unused-expression
//       expect(validCredSignature).to.be.true
//       expect(providedCredentials[0].getIssuer()).to.deep.equal(credentialFromService.getIssuer())
//       expect(providedCredentials[0].getCredentialSection())
//         .to.deep.equal(credentialFromService.getCredentialSection())
//     })
//   })

//   describe('Instant credential exchange flow for third party credential', () => {
//     let identityWalletUser
//     let identityWalletService

//     before(async () => {
//       identityWalletUser = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey,
//         privateEthereumKey: testPrivateEthereumKey
//       })

//       identityWalletService = await jolocomRegistry.create({
//         privateIdentityKey: testPrivateIdentityKey3,
//         privateEthereumKey: testPrivateEthereumKey3
//       })
//     })

//     let credentialOfferRequestJWT
//     let credentialOfferResponseJWT

//     it('Should create a correct credential offer request JWT', () => {
//       const credOfferRequest = identityWalletService.create.credentialOfferRequestJSONWebToken({
//         typ: 'credentialOfferRequest',
//         credentialOffer: {
//           challenge: 'zgbioH42',
//           callbackURL: 'https://test.de/external-cred',
//           instant: true,
//           requestedInput: {}
//         }
//       })
//       credentialOfferRequestJWT = credOfferRequest.encode()

//       expect(credOfferRequest.getPayload()).to.be.an.instanceOf(CredentialOfferRequestPayload)
//     })

//     it('Should allow for consumption of credential offer request JWT', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credOfferRequest = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferRequestJWT)
//       sinon.restore()

//       expect(credOfferRequest).to.be.an.instanceOf(CredentialOfferRequestPayload)
//     })

//     it('Should correctly create a credential offer response JWT', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credOfferRequest = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferRequestJWT)
//       sinon.restore()

//       const credOfferResponse = identityWalletUser.create.credentialOfferResponseJSONWebToken({
//         typ: 'credentialOfferResponse',
//         credentialOffer: {
//           challenge: credOfferRequest.getChallenge(),
//           callbackURL: credOfferRequest.getCallbackURL(),
//           instant: true,
//           requestedInput: {}
//         }
//       })
//       credentialOfferResponseJWT = credOfferResponse.encode()

//       expect(credOfferResponse.getPayload()).to.be.an.instanceOf(CredentialOfferResponsePayload)
//     })

//     it('Should allow for consumption of credential offer response JWT', async () => {
//       sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
//       const credOfferResponse = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferResponseJWT)
//       sinon.restore()

//       expect(credOfferResponse).to.be.an.instanceOf(CredentialOfferResponsePayload)
//     })
//     /* After a succesfull credential offer exchange the credential receive flow would be triggered
//       see the "Credential sharing flow" for more details
//     */
//   })
// })
