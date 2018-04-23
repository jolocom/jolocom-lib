export interface IPublicKeySection {
  id: string
  'type': string
  publicKeyHex: string
}

export interface IAuthenticationSection {
  id: string
  'type': string[]
}
