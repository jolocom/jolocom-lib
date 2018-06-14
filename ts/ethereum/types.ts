export interface IEthereumResolverConfig {
  providerUrl: string
  contractAddress: string
}

export interface IEthereumConnector {
  resolveDID: ({did}: {did: string}) => Promise<string>
  updateDIDRecord: ({ethereumKey, did, newHash}: {ethereumKey: object, did: string, newHash: string}) => Promise<void>
}
