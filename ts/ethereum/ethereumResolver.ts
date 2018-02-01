import EthereumResolver from 'jolocom-registry-contract'

export default class EthereumResolver{
  constructor(address: string, providerUri: string) {
    this.ethResolver = new EthereumResolver(address, providerUri)
  }
  
  resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  updateDIDRecord(sender: string, did: string, newHash: string): Promise<string> {
    return this.ethResolver.updateDIDRecord(sender, did, newHash)
  }
}
