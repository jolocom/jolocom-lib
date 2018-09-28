import * as ganache from 'ganache-cli'
import * as registryContract from 'jolocom-registry-contract'
import {
  testPrivateEthereumKey, testPrivateEthereumKey3,
} from '../data/keys'
const Web3 = require('web3')
const IPFSFactory = require('ipfsd-ctl')

const PORT = 8945
const web3 = new Web3()

const ganacheServer = ganache.server({
    accounts: [{
      balance: web3.utils.toWei('1')
    }, {
      secretKey: testPrivateEthereumKey,
      balance: web3.utils.toWei('1')
    }, {
      secretKey: testPrivateEthereumKey3,
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

export const init = async (): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {

    let address

    ganacheServer.listen(PORT, async (ganacheErr) => {
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
            return reject(spawnErr)
          }

          ipfsd.api.id((apiErr) => {
            if (apiErr) {
              return reject(apiErr)
            }

            resolve(address)
          })
        }
      )
    })
  })
}
