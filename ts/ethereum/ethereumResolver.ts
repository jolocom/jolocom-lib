import EthereumResolver from 'jolocom-registry-contract'

export default class EthResolver{
  private ethResolver: any

  constructor(address: string, providerUri: string) {
    this.ethResolver = new EthereumResolver(address, providerUri)
  }

  resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  updateDIDRecord(ethereumKey: object, did: string, newHash: string): Promise<string> {
    return this.ethResolver.updateDIDRecord(ethereumKey, did, newHash)
  }
}
