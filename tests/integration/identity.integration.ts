import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import {
  JolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
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

chai.use(sinonChai)
const expect = chai.expect

/* global before and after hook for integration tests & shared variables */
export let jolocomRegistry: JolocomRegistry
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
  jolocomRegistry = new JolocomRegistry(testEthereumConfig.providerUrl, testEthereumConfig.contractAddress, ipfsHost)

  userIdentityWallet = await jolocomRegistry.create(userVault, userPass, )
  serviceIdentityWallet = await jolocomRegistry.create(serviceVault, servicePass)
})

describe('Integration Test - Create, Resolve, Public Profile', () => {
  it('should correctly create user and service identities', async () => {
    const remoteUserIdentity = await jolocomRegistry.resolve(
      userIdentityWallet.did,
    )

    const remoteServiceIdentity = await jolocomRegistry.resolve(
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
    await jolocomRegistry.registrar.updatePublicProfile(
       serviceVault,
       servicePass,
       serviceIdentityWallet.identity,
       publicProfileCredJSON
    )


    const remoteServiceIdentity = await jolocomRegistry.resolve(
      serviceIdentityWallet.did,
    )

    expect(remoteServiceIdentity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
    expect(remoteServiceIdentity.didDocument).to.deep.eq(
      remoteServiceIdentity.didDocument,
    )
  })

  it('should correctly implement authenticate with no public profile', async () => {
    const wallet = await jolocomRegistry.authenticate(userVault, userPass)

    expect(wallet.identity.didDocument).to.deep.eq(
      userIdentityWallet.identity.didDocument,
    )
    expect(wallet.identity.publicProfile).to.deep.eq(
      userIdentityWallet.identity.publicProfile,
    )
  })

  it('should correctly implement authenticate with public profile', async () => {
    const serviceIdentity = await jolocomRegistry.authenticate(serviceVault, servicePass)
    expect(serviceIdentity.identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
  })

  it('should correctly fail to authenticate as non existing did', async () => {
    const mockVault = SoftwareKeyProvider.fromSeed(testSeed, 'pass')

    try {
      await jolocomRegistry.authenticate(mockVault, 'pass')
    } catch (err) {
      expect(err.message).to.contain(
        ErrorCodes.RegistryDIDNotAnchored
      )
    }
  })
})
