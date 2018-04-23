export interface IClaim {
  id: string
  [x: string]: string
}

export interface ICredential {
  '@context': string[]
  type: string[]
  name?: string
  claim: IClaim
}

export interface IClaimMetadata {
  type: string[]
  fieldName: string
  context?: string[]
  name?: string
}

export interface IDefaultClaimsMetadata {
  emailAddress: IClaimMetadata
  mobilePhoneNumber: IClaimMetadata
}
