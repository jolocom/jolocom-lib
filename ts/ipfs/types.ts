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
  createDagObject: (data: string, pin: boolean ) => Promise<string>
  getDagObject: (hash: string) => Promise<object>
  getDagObjectData: (hash: string) => Promise<string>
  getDagObjectLinks: (hash: string) => Promise<string>
  getDagObjectStat: (hash: string) => Promise<object>
  // tslint:disable-next-line:max-line-length
  addDagLink: ({ headNodeHash, claimId, linkNodeHash }: { headNodeHash: string, claimId: string, linkNodeHash: string } ) => Promise<object>
  resolveDagLink: ({ headNodeHash, claimId }: { headNodeHash: string, claimId: string }) => Promise<object>
}
