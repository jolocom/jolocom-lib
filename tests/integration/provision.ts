import * as ganache from 'ganache-core'
import * as registryContract from 'jolocom-registry-contract'
import { userEthKey, serviceEthKey, deployerEthKey } from './integration.data'
const Web3 = require('web3')
const IPFSFactory = require('ipfsd-ctl')

const PORT = 8945
const web3 = new Web3()
const balance = web3.utils.toWei('100')

const ganacheServer = ganache.server({
  accounts: [
    { secretKey: deployerEthKey, balance },
    { secretKey: userEthKey, balance },
    { secretKey: serviceEthKey, balance }
  ]
})

const daemonFactory = IPFSFactory.create({ type: 'go' })

/**
 * @description - Helper function to deploy the registry contract on the local eth network
 * @returns {void} - Would normally return the address of the deployed contract, but we know
 *   it already since we know the deployer addr, and their account nonce (0)
 */

const deployContract = async () => {
  web3.setProvider(new Web3.providers.HttpProvider(`http://localhost:${PORT}`))
  const deployerAddress = (await web3.eth.getAccounts())[0]
  return registryContract.TestDeployment.deployIdentityContract(web3, deployerAddress)
}

/**
 * @description - Helper function to spawn a in process ipfs node
 * @returns {void} - Once the function is executed, an ipfs endpoint
 *   available at localhost:5001
 */

const spawnIpfsNode = async () => {
  return new Promise((resolve, reject) =>
    daemonFactory.spawn(
      {
        exec: 'ipfs',
        disposable: true,
        defaultAddrs: true
      },
      (spawnErr, ipfsd) => {
        if (spawnErr) {
          return reject(spawnErr)
        }

        ipfsd.api.id(apiErr => (apiErr ? reject(apiErr) : resolve()))
      }
    )
  )
}

/**
 * @description - Initiates a mock ethereum network using ganache, a discardable ipfs node using ipfsd, and
 *   deployes the Jolocom identity registry contract.
 * @returns {void}
 */

export const init = async () =>
  new Promise<string>(async (resolve, reject) => {
    ganacheServer.listen(PORT, async ganacheErr => {
      if (ganacheErr) {
        return reject(ganacheErr)
      }

      await deployContract()
      await spawnIpfsNode()

      return resolve()
    })
  })
