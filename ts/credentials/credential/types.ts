export interface IClaimAttrs {
  id: string
  [x: string]: string
}

export interface ICredentialAttrs {
  '@context': string[] | object[]
  type: string[]
  name?: string
  claim: IClaimAttrs
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
