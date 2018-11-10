import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { EthResolver } from '../../ts/ethereum/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { testEthereumConfig, testIpfsConfig, userVault, userPass, serviceVault, servicePass, integrationCredRequestJSON, emailCredJSON } from './integration.data'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { CredentialResponse } from '../../ts/interactionTokens/credentialResponse'
import { keyIdToDid } from '../../ts/utils/helper'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - Token interaction flow Credential Request and Response', () => {
  let jolocomRegistry = createJolocomRegistry({
    ipfsConnector: new IpfsStorageAgent(testIpfsConfig),
    ethereumConnector: new EthResolver(testEthereumConfig)
  })

  let userIdentityWallet: IdentityWallet
  let serviceIdentityWallet: IdentityWallet

  before(async () => {
    userIdentityWallet = await jolocomRegistry.create(userVault, userPass)
    serviceIdentityWallet = await jolocomRegistry.create(serviceVault, servicePass)
  })
  
  let credRequestJWT
  let credRequestEncoded
  let credResponseEncoded

  it('Should correctly create a credential request token by service', async () => {
    credRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.share(integrationCredRequestJSON, servicePass)
    credRequestEncoded = credRequestJWT.encode()

    expect(credRequestJWT.getInteractionToken()).to.deep.eq(CredentialRequest.fromJSON(integrationCredRequestJSON))
    expect(credRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(credRequestJWT.getInteractionToken()).to.be.instanceOf(CredentialRequest)
  })

  it('Should allow for consumption of valid credential request token by user', async () => {
    const decodedCredRequest = JSONWebToken.decode<CredentialRequest>(credRequestEncoded)
    expect(decodedCredRequest.getInteractionToken()).to.be.instanceOf(CredentialRequest)

    try {
      await userIdentityWallet.validateJWT(decodedCredRequest, null, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }

    const emailSignedCred = await userIdentityWallet.create.signedCredential(emailCredJSON, userPass)
    const emailSecondCred = SignedCredential.fromJSON(emailSignedCred.toJSON())
    emailSecondCred.setIssuer('did:jolo:bf8095f75ec116362eb31d5e68736be6688f82db616d1dd7df5e9f99047347c3')
    const filteredCred = decodedCredRequest.getInteractionToken()
      .applyConstraints([emailSignedCred.toJSON(), emailSecondCred.toJSON()])
    
    const credResponseJWT = await userIdentityWallet.create.interactionTokens.response.share({
        callbackURL: decodedCredRequest.getInteractionToken().getCallbackURL(),
        suppliedCredentials: filteredCred
      },
      userPass,
      decodedCredRequest
    )
    credResponseEncoded = credResponseJWT.encode()

    expect(credResponseJWT.getInteractionToken()).to.be.instanceOf(CredentialResponse)
    expect(credResponseJWT.getTokenNonce()).to.eq(decodedCredRequest.getTokenNonce())
    expect(credResponseJWT.getAudience()).to.eq(keyIdToDid(decodedCredRequest.getIssuer()))
  })

  it('Should allow for consumption of valid credential response token by service', async () => {
    const decodedCredResponse = JSONWebToken.decode<CredentialResponse>(credResponseEncoded)
    expect(decodedCredResponse.getInteractionToken()).to.be.instanceOf(CredentialResponse)

    try {
      await serviceIdentityWallet.validateJWT(decodedCredResponse, credRequestJWT, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }
    
    expect(decodedCredResponse.getInteractionToken()
      .satisfiesRequest(credRequestJWT.getInteractionToken())).to.be.true
  })
})
