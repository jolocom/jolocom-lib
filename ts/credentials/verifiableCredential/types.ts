import { ICredential } from '../credential/types'
import { ILinkedDataSignature } from '../../linkedDataSignature/types'

export interface IVerifiableCredential extends ICredential {
  id: string
  issuer: string
  issued: string
  expires?: string
  proof: ILinkedDataSignature
}
