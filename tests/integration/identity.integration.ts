import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import {
  testEthereumConfig,
  userPass,
  getNewVault,
  servicePass,
  testIpfsConfig,
} from './integration.data'
import { ErrorCodes } from '../../ts/errors'
import { IDidMethod } from '../../ts/didMethods/types'
import { JoloDidMethod } from '../../ts/didMethods/jolo'
import { LocalDidMethod } from '../../ts/didMethods/local'
import {
  createIdentityFromKeyProvider,
  authAsIdentityFromKeyProvider,
} from '../../ts/didMethods/utils'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'
import { walletUtils } from '@jolocom/native-utils-node'
import { createDb } from 'local-did-resolver/js/db'

chai.use(sinonChai)
const expect = chai.expect

/* global before and after hook for integration tests & shared variables */
export let joloDidMethod: IDidMethod
export let localDidMethod: IDidMethod
export let userIdentityWallet: IdentityWallet
export let serviceIdentityWallet: IdentityWallet
export let userVault: SoftwareKeyProvider
export let serviceVault: SoftwareKeyProvider

before(async () => {
  const eventDb = createDb()
  localDidMethod = new LocalDidMethod(eventDb)

  //  const ipfsHost = `${testIpfsConfig.protocol}://${testIpfsConfig.host}:${testIpfsConfig.port}`
  //  joloDidMethod = new JoloDidMethod(
  //    testEthereumConfig.providerUrl,
  //    testEthereumConfig.contractAddress,
  //    // ipfsHost,
  //  )

  userVault = await getNewVault('id', userPass)
  serviceVault = await getNewVault('id', servicePass)

  userIdentityWallet = await createIdentityFromKeyProvider(
    userVault,
    userPass,
    localDidMethod.registrar,
  )
  serviceIdentityWallet = await createIdentityFromKeyProvider(
    serviceVault,
    servicePass,
    localDidMethod.registrar,
  )
})

describe('Integration Test - Create, Resolve, Public Profile', () => {
  const publicProfileContent = {
    name: 'Test Service',
    description: 'Integration test service',
    url: 'https://test.com',
    image: 'https://images.com',
  }

  it('should correctly create user and service identities', async () => {
    const remoteUserIdentity = await localDidMethod.resolver.resolve(
      userIdentityWallet.did,
    )

    const remoteServiceIdentity = await localDidMethod.resolver.resolve(
      serviceIdentityWallet.did,
    )

    // TODO Created on proof is generated ad-hoc, via date.now()
    // expect(remoteUserIdentity.didDocument.toJSON()).to.deep.eq(
    //   userIdentityWallet.didDocument.toJSON(),
    // )

    // expect(remoteServiceIdentity.didDocument.toJSON()).to.deep.eq(
    //   remoteServiceIdentity.didDocument.toJSON(),
    // )
  })

  // TODO No public profile on local method yet
  it.skip('should correctly add and commit public profile', async () => {
    await joloDidMethod.registrar.updatePublicProfile(
      serviceVault,
      servicePass,
      serviceIdentityWallet.identity,
      await serviceIdentityWallet.create.signedCredential(
        {
          metadata: claimsMetadata.publicProfile,
          claim: publicProfileContent,
          subject: serviceIdentityWallet.did,
        },
        servicePass,
      ),
    )

    const remoteServiceIdentity = await joloDidMethod.resolver.resolve(
      serviceIdentityWallet.did,
    )

    expect(remoteServiceIdentity.publicProfile.claim).to.deep.eq({
      ...publicProfileContent,
      id: remoteServiceIdentity.did,
    })
    expect(remoteServiceIdentity.didDocument).to.deep.eq(
      remoteServiceIdentity.didDocument,
    )
  })

  it('should correctly implement authenticate with no public profile', async () => {
    const wallet = await authAsIdentityFromKeyProvider(
      userVault,
      userPass,
      localDidMethod.resolver,
    )

    // TODO On the local method created on proof is populated automatically
    // expect(wallet.identity.didDocument).to.deep.eq(
    //   userIdentityWallet.identity.didDocument,
    // )

    expect(wallet.identity.publicProfile).to.deep.eq(
      userIdentityWallet.identity.publicProfile,
    )
  })

  it.skip('should correctly implement authenticate with public profile', async () => {
    const serviceIdentity = await authAsIdentityFromKeyProvider(
      serviceVault,
      servicePass,
      joloDidMethod.resolver,
    )
    expect(serviceIdentity.identity.publicProfile.subject).to.deep.eq(
      serviceIdentity.did,
    )
    expect(serviceIdentity.identity.publicProfile.claim).to.deep.eq({
      ...publicProfileContent,
      id: serviceIdentity.did,
    })
  })

  it('should correctly fail to authenticate as non existing did', async () => {
    const mockVault = await SoftwareKeyProvider.newEmptyWallet(
      walletUtils,
      'did:un:wroooooooooong',
      'pass',
    )

    try {
      await authAsIdentityFromKeyProvider(
        mockVault,
        'pass',
        localDidMethod.resolver,
      )
    } catch (err) {
      expect(err.message).to.contain(ErrorCodes.RegistryDIDNotAnchored)
    }
  })
})
