import * as ganache from 'ganache-core'
import { deployerEthKey, serviceEthKey, userEthKey } from './integration.data'
import { ContractsGateway } from '../../ts/contracts/contractsGateway'
import { ContractsAdapter } from '../../ts/contracts/contractsAdapter'
import * as RegistryContract from 'jolocom-registry-contract/build/contracts/Registry.json'
import { ethers } from 'ethers'

const IPFSFactory = require('ipfsd-ctl')

const PORT = 8945

const balance = 1e24
const ganacheServer = ganache.server({
  accounts: [
    { secretKey: deployerEthKey, balance },
    { secretKey: userEthKey, balance },
    { secretKey: serviceEthKey, balance },
  ],
})

/**
 * @description - Helper function to deploy the registry contract on the local eth network
 * @returns {void} - Would normally return the address of the deployed contract, but we know
 *   it already since we know the deployer addr, and their account nonce (0)
 */

const deployContract = async (port: number): Promise<string> => {
  let provider = new ethers.providers.JsonRpcProvider(
    `http://localhost:${port}`,
  )
  let wallet = new ethers.Wallet(deployerEthKey, provider)
  let factory = new ethers.ContractFactory(
    RegistryContract.abi,
    RegistryContract.bytecode,
    wallet,
  )
  let contract = await factory.deploy()
  await contract.deployed()
  console.log('deployed')
  return contract.address
}

/**
 * @description - Helper function to spawn a in process ipfs node
 * @returns {void} - Once the function is executed, an ipfs endpoint
 *   available at localhost:5001
 */

const spawnIpfsNode = async () => {
  const daemonFactory = IPFSFactory.create({ type: 'go' })

  return new Promise((resolve, reject) =>
    daemonFactory.spawn(
      {
        exec: 'ipfs',
        disposable: true,
        defaultAddrs: true,
      },
      (spawnErr, ipfsd) => {
        if (spawnErr) {
          return reject(spawnErr)
        }

        ipfsd.api.id(apiErr => (apiErr ? reject(apiErr) : resolve()))
      },
    ),
  )
}

/**
 * @description - Initiates a mock ethereum network using ganache, a discardable ipfs node using ipfsd, and
 *   deploys the Jolocom identity registry contract.
 * @returns {void}
 */

export const init = async (): Promise<{
  ganache
  contractAddress: string
}> => {
  ganacheServer.listen(PORT, (err, blockchain) => blockchain)

  const contractAddress = await deployContract(PORT)
  await spawnIpfsNode()
  return {
    ganache: ganacheServer,
    contractAddress: contractAddress,
  }
}
