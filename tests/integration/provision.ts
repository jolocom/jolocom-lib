import * as ganache from 'ganache-cli'
import * as wallet from 'ethereumjs-wallet'
import * as registryContract from 'jolocom-registry-contract'
import {
  testPrivateEthereumKey,
} from '../data/keys'
const Web3 = require('web3')
const IPFSFactory = require('ipfsd-ctl')

const testAccount = wallet.fromPrivateKey(testPrivateEthereumKey).getAddress().toString('hex')

const server = ganache.server(
  {
    accounts: [`${testAccount},1`]
  }
)
const daemonFactory = IPFSFactory.create({type: 'go'})

const deployContract = () => {
  const web3 = new Web3(server)
}

export const init = async () => {
  return new Promise((resolve, reject) => {
    server.listen(8546, (ganacheErr, blockchain) => {
        if (ganacheErr) { return reject(ganacheErr) }

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
              return resolve()
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
