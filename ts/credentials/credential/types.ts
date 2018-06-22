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
  fieldNames: string[]
  type: string[]
  context: string[] | object[]
  name?: string
}

export interface IDefaultClaimsMetadata {
  emailAddress: IClaimMetadata
  mobilePhoneNumber: IClaimMetadata
  name: IClaimMetadata
}

export interface IDefaultPublicProfileClaimsMetadata {
  id: IClaimMetadata
  name: IClaimMetadata
  image?: IClaimMetadata
  about: IClaimMetadata
  homepage?: IClaimMetadata
}
