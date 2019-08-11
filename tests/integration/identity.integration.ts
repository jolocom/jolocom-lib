import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { EthResolver } from '../../ts/ethereum/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import {
  createJolocomRegistry,
  JolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { publicProfileCredJSON } from '../data/identity.data'
import {
  testEthereumConfig,
  testIpfsConfig,
  userVault,
  userPass,
  serviceVault,
  servicePass,
} from './integration.data'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testSeed } from '../data/keys.data'
import { ContractsGateway } from '../../ts/contracts/contractsGateway'
import { ContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { createJolocomResolver, MultiResolver } from '../../ts/resolver'

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

  const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
  const ethereumConnector = new EthResolver(testEthereumConfig)

  jolocomRegistry = createJolocomRegistry({
    ipfsConnector,
    ethereumConnector,
    contracts: { gateway, adapter },
    didResolver: createJolocomResolver(ethereumConnector, ipfsConnector)
  })

  userIdentityWallet = await jolocomRegistry.create(userVault, userPass)
  serviceIdentityWallet = await jolocomRegistry.create(
    serviceVault,
    servicePass,
  )
})

after(() => {
  process.exit(0)
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
    const servicePublicProfile = SignedCredential.fromJSON(
      publicProfileCredJSON,
    )
    serviceIdentityWallet.identity.publicProfile = servicePublicProfile

    await jolocomRegistry.commit({
      vaultedKeyProvider: serviceVault,
      identityWallet: serviceIdentityWallet,
      keyMetadata: {
        derivationPath: KeyTypes.ethereumKey,
        encryptionPass: servicePass,
      },
    })

    const remoteServiceIdentity = await jolocomRegistry.resolve(
      serviceIdentityWallet.did,
    )

    expect(remoteServiceIdentity.publicProfile).to.deep.eq(servicePublicProfile)
    expect(remoteServiceIdentity.didDocument).to.deep.eq(
      remoteServiceIdentity.didDocument,
    )
  })

  it('should correctly implement authenticate with no public profile', async () => {
    const wallet = await jolocomRegistry.authenticate(userVault, {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: userPass,
    })
    expect(wallet.identity.didDocument).to.deep.eq(
      userIdentityWallet.identity.didDocument,
    )
    expect(wallet.identity.publicProfile).to.deep.eq(
      userIdentityWallet.identity.publicProfile,
    )
  })

  it('should correctly implement authenticate with public profile', async () => {
    const wallet = await jolocomRegistry.authenticate(serviceVault, {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: servicePass,
    })

    const remoteDidDoc = wallet.didDocument.toJSON()
    const localDidDoc = serviceIdentityWallet.didDocument.toJSON()

    const remotePubProf = wallet.identity.publicProfile.toJSON()

    const localPubProf = serviceIdentityWallet.identity.publicProfile.toJSON()

    expect(remoteDidDoc).to.deep.eq(localDidDoc)
    expect(remotePubProf).to.deep.eq(localPubProf)
  })

  it('should correctly fail to authenticate as non existing did', async () => {
    const mockVault = SoftwareKeyProvider.fromSeed(testSeed, 'pass')

    try {
      await jolocomRegistry.authenticate(mockVault, {
        derivationPath: KeyTypes.jolocomIdentityKey,
        encryptionPass: 'pass',
      })
    } catch (err) {
      expect(err.message).to.eq(
        'Could not retrieve DID Document. No record for DID found.',
      )
    }
  })
})
