import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { ICredentialReceivePayloadAttrs, ICredentialReceivePayloadCreationAttrs } from './types'
import { CredentialReceive } from './credentialReceive'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export class CredentialReceivePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialReceive: CredentialReceive

  public static create(attrs: ICredentialReceivePayloadCreationAttrs): CredentialReceivePayload {
    const credentialReceive = attrs.credentialReceive
    
    if(attrs.typ !== InteractionType.CredentialsReceive) {
      throw new Error('Incorrect payload for CredentialReceive')
    }

    const credentialReceivePayload = new CredentialReceivePayload()
    credentialReceivePayload.credentialReceive = plainToClass(CredentialReceive, credentialReceive)

    return credentialReceivePayload
  }


  public getSignedCredentials(): SignedCredential[] {
    return this.credentialReceive.getSignedCredentials()
  }

  public static fromJSON(json: ICredentialReceivePayloadAttrs): CredentialReceivePayload {
    const credentialReceivePayload = plainToClass(CredentialReceivePayload, json)
    credentialReceivePayload.credentialReceive = plainToClass(CredentialReceive, json.credentialReceive)
    
    return credentialReceivePayload
  }

  public toJSON(): ICredentialReceivePayloadAttrs {
    return classToPlain(this) as ICredentialReceivePayloadAttrs
  }
}
