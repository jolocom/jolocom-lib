export interface IEthereumResolverConfig {
  providerUrl: string
  contractAddress: string
}

export interface IEthereumConnector {
  resolveDID: (did: string) => Promise<string>
  updateDIDRecord: (ethereumKey: object, did: string, newHash: string) => Promise<void>
}
