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

const server = ganache.server(
  {
    accounts: [
      `${testAccount},0.1`,
      `${fromAccount},100`,
      '0xD8538c2A03373C2D96535D61ecca182A3F413893,100'
    ]
  }
)
const daemonFactory = IPFSFactory.create({type: 'go'})

const deployContract = async () => {
  const web3 = new Web3()
  console.log(server.provider.options.accounts)
  web3.setProvider(server.provider)
  web3.eth.setProvider(server.provider)
  web3.eth.personal.setProvider(server.provider)
  const accounts = await web3.eth.getAccounts()
  const pass = '@#%*&SecurePass'
  const account = await web3.eth.personal.newAccount(pass)
  await web3.eth.personal.unlockAccount(account, pass, 10000)
  console.log(accounts)
  console.log(account)
  const address = await registryContract.TestDeployment.deployIdentityContract(
    web3,
    '0xD8538c2A03373C2D96535D61ecca182A3F413893'
  )
  console.log(address)
  return address
}

export const init = async () => {
  return new Promise(async (resolve, reject) => {
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
              resolve()
            });
          }
        )
      })
    return await deployContract()
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
