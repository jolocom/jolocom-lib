export interface IIpfsConfig {
  host: string
  port: number
  protocol: string
}

export interface IIpfsConnector {
  configure: (config: IIpfsConfig) => void
  storeJSON: (data: object, pin: boolean) => Promise<string>
  catJSON: (hash: string) => Promise<object>
  removePinnedHash: (hash: string) => Promise<void>
<<<<<<< HEAD
  createDagObject: (data: object, pin: boolean ) => Promise<string>
  resolveIpldPath: (pathToResolve: string) => Promise<object>
=======
  createDagObject: (data: string, pin: boolean ) => Promise<string>
  getDagObjectData: (hash: string, getData: boolean) => Promise<string>
>>>>>>> IPFS object put and get methods
}
