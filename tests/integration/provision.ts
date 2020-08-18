import * as ganache from 'ganache-core'
import { userEthKey, serviceEthKey, deployerEthKey } from './integration.data'
// import { ContractsGateway } from '../../ts/contracts/contractsGateway'
// import { ContractsAdapter } from '../../ts/contracts/contractsAdapter'
// import { ethers } from 'ethers'

// const IPFSFactory = require('ipfsd-ctl')
// const RegistryContract = require('jolocom-registry-contract/build/contracts/Registry.json')
// const PORT = 8945
// const balance = 1e18
// const ganacheServer = ganache.server({
//   accounts: [
//     { secretKey: deployerEthKey, balance },
//     { secretKey: userEthKey, balance },
//     { secretKey: serviceEthKey, balance },
//   ],
// })

// const daemonFactory = IPFSFactory.create({ type: 'go' })

/**
 * @description - Helper function to deploy the registry contract on the local eth network
 * @returns {void} - Would normally return the address of the deployed contract, but we know
 *   it already since we know the deployer addr, and their account nonce (0)
 */

// const deployContract = async () => {
//   let provider = new ethers.providers.JsonRpcProvider(
//     `http://localhost:${PORT}`,
//   )
//   let wallet = new ethers.Wallet(deployerEthKey, provider)
//   let factory = new ethers.ContractFactory(
//     RegistryContract.abi,
//     RegistryContract.bytecode,
//     wallet,
//   )
//   let contract = await factory.deploy()
//   await contract.deployed()
//   return contract.address
// }

/**
 * @description - Helper function to spawn a in process ipfs node
 * @returns {void} - Once the function is executed, an ipfs endpoint
 *   available at localhost:5001
 */

// const spawnIpfsNode = async () => {
//   return new Promise((resolve, reject) =>
//     daemonFactory.spawn(
//       {
//         exec: 'ipfs',
//         disposable: true,
//         defaultAddrs: true,
//       },
//       (spawnErr, ipfsd) => {
//         if (spawnErr) {
//           return reject(spawnErr)
//         }
//
//         ipfsd.api.id(apiErr => (apiErr ? reject(apiErr) : resolve()))
//       },
//     ),
//   )
// }

/**
 * @description - Initiates a mock ethereum network using ganache, a discardable ipfs node using ipfsd, and
 *   deploys the Jolocom identity registry contract.
 * @returns {void}
 */

// interface ContractClassess {
//   testContractsGateway: ContractsGateway
//   testContractsAdapter: ContractsAdapter
// }

// export const init = async () =>
//   new Promise<ContractClassess>(async (resolve, reject) => {
//     ganacheServer.listen(PORT, async ganacheErr => {
//       if (ganacheErr) {
//         return reject(ganacheErr)
//       }

//       await deployContract()
//       // await spawnIpfsNode()

//       const testContractsGateway = new ContractsGateway(
//         `http://localhost:${PORT}`,
//       )
//       const testContractsAdapter = new ContractsAdapter()

//       return resolve({
//         testContractsGateway,
//         testContractsAdapter,
//       })
//     })
//   })
