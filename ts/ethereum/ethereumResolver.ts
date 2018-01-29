import * as Web3 from 'web3'
import * as RegistryContract from '../../contracts/Registry.json'

export default class EthereumResolver{
  constructor() {
    const address = '0xc4b48901af7891d83ce83877e1f8fb4c81a94907'

    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    this.indexContract = new this.web3.eth.Contract(RegistryContract.abi, address)
  }
  
  resolveDID(did: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const keyHash = this._stripMethodPrefix(did)
      this.indexContract.methods.getRecord(keyHash).call((error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })
  }

  updateDIDRecord(sender: string, did: string, newHash: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const keyHash = this._stripMethodPrefix(did)
      

      this.indexContract.methods.setRecord(keyHash, newHash).send({
        from: sender,
      },(error, result) => {
        if (error) {
          return reject(error)
        }

        /* The web3 provider needs to support WSS, 
         * will be configured at later stage

        this.indexContract.events.registrationSuccess((error, result) => {
          console.log(error)
          console.log(result)
        })

        */

        return resolve()
      })
    })
  }

  private _stripMethodPrefix(did: string): string {
    return did.substring(did.lastIndexOf(':') + 1)
  }
}
