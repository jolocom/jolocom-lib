export interface IClaim {
  id: string
  [x: string]: string
}

export interface ICredential {
  '@context': string[] | object[]
  type: string[]
  name?: string
  claim: IClaim
}

export interface IClaimMetadata {
  fieldName: string
  type: string[]
  context: string[] | object[]
  name?: string
}

export interface IDefaultClaimsMetadata {
  emailAddress: IClaimMetadata
  mobilePhoneNumber: IClaimMetadata
}
