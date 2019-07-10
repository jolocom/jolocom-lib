import { IdentityData } from 'jolocom-registry-contract'

export interface IEthereumResolverConfig {
  providerUrl: string
  contractAddress: string
}

export interface IEthereumResolverUpdateDIDArgs {
  ethereumKey: Buffer
  did: string
  owner: string
  newHash: string
}

export interface IEthereumConnector {
  resolveDID: (did: string) => Promise<IdentityData>
  updateDIDRecord: (args: IEthereumResolverUpdateDIDArgs) => Promise<Date>
  getUpdated: (did: string) => Promise<Date>
  getCreated: (did: string) => Promise<Date>
  getUpdatedCount: (did: string) => Promise<number>
}
