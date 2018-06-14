export interface IIpfsConfig {
  host: string
  port: number
  protocol: string
}

export interface IIpfsConnector {
  storeJSON: ({data, pin}: {data: object, pin: boolean}) => Promise<string>
  catJSON: ({hash}: {hash: string}) => Promise<object>
  removePinnedHash: ({hash}: {hash: string}) => Promise<void>
}
