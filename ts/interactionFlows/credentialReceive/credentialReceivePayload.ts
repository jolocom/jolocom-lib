import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { ICredentialReceivePayloadAttrs } from './types'
import { CredentialReceive } from './credentialReceive'

export class CredentialReceivePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialReceive: CredentialReceive

  public static fromJSON(json: ICredentialReceivePayloadAttrs): CredentialReceivePayload {
    const credentialReceivePayload = plainToClass(CredentialReceivePayload, json)
    credentialReceivePayload.credentialReceive = plainToClass(CredentialReceive, json.credentialReceive)
    
    return credentialReceivePayload
  }

  public toJSON(): ICredentialReceivePayloadAttrs {
    return classToPlain(this) as ICredentialReceivePayloadAttrs
  }
}
