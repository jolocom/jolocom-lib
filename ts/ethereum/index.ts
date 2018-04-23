import EthereumResolver from 'jolocom-registry-contract'

export class EthResolver {
  private ethResolver: any

  constructor(address: string, providerUri: string) {
    this.ethResolver = new EthereumResolver(address, providerUri)
  }

  public async resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  public async updateDIDRecord(ethereumKey: object, did: string, newHash: string): Promise<void> {
    return this.ethResolver.updateDIDRecord(ethereumKey, did, newHash)
  }
}
