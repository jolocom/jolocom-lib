import * as ganache from 'ganache-cli'
import * as ipfs from "ipfs"
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
const ipfsServer = IPFSFactory.createServer({port: 43134})
const daemonFactory = IPFSFactory.create({
  port: 4313,
  exec: require.resolve('ipfs'),
  disposable: true,
  defaultAddrs: true,
})

const deployContract = () => {
  const web3 = new Web3(server)
}

export const init = () => {
  console.log(testAccount)
  server.listen(8546, (err, blockchain) => {
    console.log(blockchain)

    ipfsServer.start((err) => {
      daemonFactory.spawn((err, ipfsd) => {
        if (err) {
          console.log('Could not spawn ipfs node ' + err.message)
        }
        ipfsd.api.id(function (err, id) {
          if (err) { throw err }
          console.log(id)
      });
    })

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
