import VerifiableCredential from './verifiableCredential'

export interface IVerifiableCredentialAttrs {
  '@context': string;
  id: string;
  "type": string[];
  issuer: string;
  issued: string;
  expires?: string;
  claim: { id: string; [x:string]:any };
}

export interface IClaim {
  id: string;
  [x:string]: any;
}

export interface IVerifiedCredential {
  credential: VerifiableCredential;
  signature: string;
}
