import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import {
  testEthereumConfig,
  userVault,
  userPass,
  serviceVault,
  servicePass,
  testIpfsConfig
} from './integration.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { publicProfileCredJSON } from '../data/identity.data'
import { ContractsGateway } from '../../ts/contracts/contractsGateway'
import { ContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { ErrorCodes } from '../../ts/errors'
import { IDidMethod } from '../../ts/didMethods/types'
import { JoloDidMethod } from '../../ts/didMethods/jolo'
import { createJoloIdentity, authJoloIdentity } from '../../ts/didMethods/jolo/utils'
import { claimsMetadata } from '@jolocom/protocol-ts'

chai.use(sinonChai)
const expect = chai.expect

/* global before and after hook for integration tests & shared variables */
export let joloDidMethod: IDidMethod
export let userIdentityWallet: IdentityWallet
export let serviceIdentityWallet: IdentityWallet
export let testContractsGateway: ContractsGateway
export let testContractsAdapter: ContractsAdapter

before(async () => {
  const {
    testContractsGateway: gateway,
    testContractsAdapter: adapter,
  } = await integrationHelper.init()

  testContractsGateway = gateway
  testContractsAdapter = adapter

  const ipfsHost = `${testIpfsConfig.protocol}://${testIpfsConfig.host}:${testIpfsConfig.port}`
  joloDidMethod = new JoloDidMethod(testEthereumConfig.providerUrl, testEthereumConfig.contractAddress, ipfsHost)

  userIdentityWallet = await createJoloIdentity(userVault, userPass, joloDidMethod.registrar)
  serviceIdentityWallet = await createJoloIdentity(serviceVault, servicePass, joloDidMethod.registrar)
})

describe('Integration Test - Create, Resolve, Public Profile', () => {
  const publicProfileContent = {
     name: 'Test Service',
     description: 'Integration test service',
     url: 'https://test.com',
     image: 'https://images.com'
  }

  it('should correctly create user and service identities', async () => {
    const remoteUserIdentity = await joloDidMethod.resolver.resolve(
      userIdentityWallet.did,
    )

    const remoteServiceIdentity = await joloDidMethod.resolver.resolve(
      serviceIdentityWallet.did,
    )

    expect(remoteUserIdentity.didDocument).to.deep.eq(
      userIdentityWallet.didDocument,
    )
    expect(remoteServiceIdentity.didDocument).to.deep.eq(
      remoteServiceIdentity.didDocument,
    )
  })

  it('should correctly add and commit public profile', async () => {
    await joloDidMethod.registrar.updatePublicProfile(
       serviceVault,
       servicePass,
       serviceIdentityWallet.identity,
       await serviceIdentityWallet.create.signedCredential({
         metadata: claimsMetadata.publicProfile,
         claim: publicProfileContent,
         subject: serviceIdentityWallet.did
       }, servicePass)
    )


    const remoteServiceIdentity = await joloDidMethod.resolver.resolve(
      serviceIdentityWallet.did,
    )

    expect(remoteServiceIdentity.publicProfile.claim).to.deep.eq({...publicProfileContent, id: remoteServiceIdentity.did})
    expect(remoteServiceIdentity.didDocument).to.deep.eq(
      remoteServiceIdentity.didDocument,
    )
  })

  it('should correctly implement authenticate with no public profile', async () => {
    const wallet = await authJoloIdentity(userVault, userPass, joloDidMethod.resolver)

    expect(wallet.identity.didDocument).to.deep.eq(
      userIdentityWallet.identity.didDocument,
    )
    expect(wallet.identity.publicProfile).to.deep.eq(
      userIdentityWallet.identity.publicProfile,
    )
  })

  it('should correctly implement authenticate with public profile', async () => {
    const serviceIdentity = await authJoloIdentity(serviceVault, servicePass, joloDidMethod.resolver)
    expect(serviceIdentity.identity.publicProfile.subject).to.deep.eq(serviceIdentity.did)
    expect(serviceIdentity.identity.publicProfile.claim).to.deep.eq({...publicProfileContent, id: serviceIdentity.did})
  })

  it('should correctly fail to authenticate as non existing did', async () => {
    const mockVault = SoftwareKeyProvider.fromSeed(testSeed, 'pass')

    try {
      await authJoloIdentity(mockVault, 'pass', joloDidMethod.resolver)
    } catch (err) {
      expect(err.message).to.contain(
        ErrorCodes.RegistryDIDNotAnchored
      )
    }
  })
})
