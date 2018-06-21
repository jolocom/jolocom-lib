import { ICredentialAttrs, IClaimAttrs } from '../credential/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'

export interface IPublicProfileCredentialAttrs extends ICredentialAttrs {
  id: string
  issuer: string
  issued: string
  claim: IClaimAttrs
  proof: ILinkedDataSignatureAttrs
}
