import AuthenticationCredential from './authenticationCredential'
import Did from './did'

export interface IAuthenticationCredentialAttrs {
  id: string;
  'type': string[];
  owner: string;
  curve: string;
  publicKeyBase64: string;
}

export interface IDidDocumentAttrs {
  '@context': string;
  id: string;
  authenticationCredential: string;
  created: string;
}

export default interface IdentityConfig {
  providerUrl: string
  contractAddress: string
}

export interface IpfsConfig {
  host: string;
  port: number;
  protocol: string;
}
