export interface IIpfsConfig {
  host: string
  port: number
  protocol: string
}

export interface IIpfsConnector {
  storeJSON: ({ data, pin }: { data: object; pin: boolean }) => Promise<string>
  catJSON: (hash: string) => Promise<object | object[]>
  removePinnedHash: (hash: string) => Promise<void>
}
