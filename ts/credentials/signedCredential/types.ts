import { ICredentialAttrs, IClaimSection } from '../credential/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'

export interface ISignedCredentialAttrs extends ICredentialAttrs {
  id: string
  issuer: string
  issued: string
  expires?: string
  claim: IClaimSection
  proof: ILinkedDataSignatureAttrs
}