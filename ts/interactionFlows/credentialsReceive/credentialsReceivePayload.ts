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

    const crp = new CredentialsReceivePayload()
    crp.credentialsReceive = plainToClass(CredentialsReceive, credentialsReceive)
    crp.credentialsReceive.signedCredentials = credentialsReceive.signedCredentials
      .map(sCred => plainToClass(SignedCredential, sCred))
    crp.typ = InteractionType.CredentialsReceive

    if (attrs.iss) {
      crp.iss = attrs.iss
    }

    return crp
  }

  public getSignedCredentials(): SignedCredential[] {
    return this.credentialsReceive.getSignedCredentials()
  }

  public static fromJSON(json: ICredentialsReceivePayloadAttrs): CredentialsReceivePayload {
    const crp = plainToClass(CredentialsReceivePayload, json)
    crp.credentialsReceive = plainToClass(CredentialsReceive, json.credentialsReceive)
    crp.credentialsReceive.signedCredentials = json.credentialsReceive.signedCredentials
      .map(sCred => plainToClass(SignedCredential, sCred))

    return crp
  }

  public toJSON(): ICredentialsReceivePayloadAttrs {
    return classToPlain(this) as ICredentialsReceivePayloadAttrs
  }
}
