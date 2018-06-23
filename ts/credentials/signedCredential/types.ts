import { ICredentialAttrs, IClaimAttrs, ICredentialCreateAttrs } from '../credential/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'

export interface ISignedCredentialAttrs extends ICredentialAttrs {
  id: string
  issuer: string
  issued: string
  expires?: string
  claim: IClaimAttrs
  proof: ILinkedDataSignatureAttrs
}

export interface ISignedCredentialCreateArgs {
  credentialAttrs: ICredentialCreateAttrs
  privateIdentityKey: Buffer
}
