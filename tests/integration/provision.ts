import * as ganache from 'ganache-cli'
import * as wallet from 'ethereumjs-wallet'
import * as registryContract from 'jolocom-registry-contract'
import {
  testPrivateEthereumKey,
} from '../data/keys'
import { checkServerIdentity } from 'tls';
const Web3 = require('web3')
const IPFSFactory = require('ipfsd-ctl')

const testAccount = wallet.fromPrivateKey(testPrivateEthereumKey).getAddress().toString('hex')
const fromAccount = '0x3a05343912C4D59948c11567788006114eB15FF0'

const PORT = 8945
const web3 = new Web3()

const ganacheServer = ganache.server({
    accounts: [{
      balance: web3.utils.toWei('1')
    }, {
      secretKey: testPrivateEthereumKey,
      balance: web3.utils.toWei('1')
    }]
  })

const daemonFactory = IPFSFactory.create({type: 'go'})

const deployContract = async () => {
  web3.setProvider(new Web3.providers.HttpProvider(`http://localhost:${PORT}`))
  const deployerAddress = (await web3.eth.getAccounts())[0]
  const address = await registryContract.TestDeployment.deployIdentityContract(
    web3,
    deployerAddress
  )
  return address
}

export const init = async () => {
  return new Promise(async (resolve, reject) => {
    let address

    ganacheServer.listen(PORT, async (ganacheErr, blockchain) => {
      if (ganacheErr) { return reject(ganacheErr) }

      address = await deployContract()

      daemonFactory.spawn(
        {
          exec: 'ipfs',
          disposable: true,
          defaultAddrs: true
        },
        (spawnErr, ipfsd) => {
          if (spawnErr) {
            return reject(spawnErr);
          }

          ipfsd.api.id(function (apiErr, id) {
            if (apiErr) {
              return reject(apiErr);
            }

            resolve(address)
          });
        }
      )
    })
  })
}
// const startTest = () => {
//   node.version((err, version) => {
//     if (err) {
//       console.log('Failed to start node')
//       return
//     }
//     console.log(version)
//   })
// }

// const cleanUp = () => {
//   console.log('stopped')
// }

// const node = new ipfs()
// node.on('ready', startTest)
// node.on('stop', cleanUp)
