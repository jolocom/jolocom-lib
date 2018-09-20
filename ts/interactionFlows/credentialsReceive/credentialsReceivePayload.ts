import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { ICredentialsReceivePayloadAttrs, ICredentialsReceivePayloadCreationAttrs } from './types'
import { CredentialsReceive } from './credentialsReceive'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export class CredentialsReceivePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialsReceive: CredentialsReceive

  public static create(attrs: ICredentialsReceivePayloadCreationAttrs): CredentialsReceivePayload {
    const credentialsReceive = attrs.credentialsReceive
    
    if(attrs.typ !== InteractionType.CredentialsReceive) {
      throw new Error('Incorrect payload for CredentialReceive')
    }

    const credentialsReceivePayload = new CredentialsReceivePayload()
    credentialsReceivePayload.credentialsReceive = plainToClass(CredentialsReceive, credentialsReceive)
    credentialsReceivePayload.typ = attrs.typ

    return credentialsReceivePayload
  }


  public getSignedCredentials(): SignedCredential[] {
    return this.credentialsReceive.getSignedCredentials()
  }

  public static fromJSON(json: ICredentialsReceivePayloadAttrs): CredentialsReceivePayload {
    const credentialsReceivePayload = plainToClass(CredentialsReceivePayload, json)
    credentialsReceivePayload.credentialsReceive = plainToClass(CredentialsReceive, json.credentialsReceive)
    
    return credentialsReceivePayload
  }

  public toJSON(): ICredentialsReceivePayloadAttrs {
    return classToPlain(this) as ICredentialsReceivePayloadAttrs
  }
}
