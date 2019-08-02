import { DependencyIndex } from './index'
import {
  emailCredJSON,
  servicePass,
  userPass,
  userVault,
} from './integration.data'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import * as chai from 'chai'
import { jsonAuthentication } from '../data/interactionTokens/authentication.data'
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry'
import {MultiResolver} from '../../ts/resolver'

const expect = chai.expect

export const testCustomDeployments = (
  dependencies: Partial<DependencyIndex>,
) => () => {
  let jolocomRegistry: JolocomRegistry
  let customRegistry: JolocomRegistry
  let serviceIdentityWallet: IdentityWallet
  let customUserIdentityWallet: IdentityWallet
  let resolver: MultiResolver

  before(async () => {
    resolver = dependencies.resolver
    jolocomRegistry = dependencies.jolocomRegistry
    serviceIdentityWallet = dependencies.serviceIdentityWallet
    customRegistry = dependencies.customRegistry
    customUserIdentityWallet = await customRegistry.create(userVault, userPass)
  })

  it('Correctly creates identity using the custom registry', async () => {
    expect(customUserIdentityWallet.did).to.include('did:test:')
  })

  it('Should use custom DID prefix when creating interaction tokens and credentials', async () => {
    const authenticationRequest = await customUserIdentityWallet.create.interactionTokens.request.auth(
      jsonAuthentication,
      userPass,
    )

    const credential = await customUserIdentityWallet.create.signedCredential(
      emailCredJSON,
      userPass,
    )
    expect(authenticationRequest.issuer).to.include(
      customUserIdentityWallet.did,
    )
    expect(credential.issuer).to.include(customUserIdentityWallet.did)
    expect(credential.subject).to.eq(emailCredJSON.subject)
  })

  it('Should correctly handle the authentication flow across the custom and canonical deployments', async () => {
    const authenticationRequest = await serviceIdentityWallet.create.interactionTokens.request.auth(
      jsonAuthentication,
      servicePass,
    )

    await customUserIdentityWallet.validateJWT(
      authenticationRequest,
      undefined,
      resolver,
    )

    const authenticationResponse = await customUserIdentityWallet.create.interactionTokens.response.auth(
      jsonAuthentication,
      userPass,
      authenticationRequest,
    )

    await serviceIdentityWallet.validateJWT(
      authenticationResponse,
      authenticationRequest,
      resolver,
    )
  })
}
