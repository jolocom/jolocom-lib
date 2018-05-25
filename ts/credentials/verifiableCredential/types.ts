import { ICredentialAttrs, IClaimAttrs } from '../credential/types'
import { ILinkedDataSignature, ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { Credential } from '../credential';
import { VerifiableCredential } from '.';
import { IPrivateKey } from '../../wallet/types';

export interface IVerifiableCredentialAttrs extends ICredentialAttrs {
  id: string
  issuer: string
  issued: string
  expires?: string
  claim: IClaimAttrs
  proof: ILinkedDataSignatureAttrs
}
