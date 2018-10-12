import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { ICredentialRequestPayloadAttrs, ICredentialRequestPayloadCreationAttrs } from './types'
import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export class CredentialRequestPayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialRequest: CredentialRequest

  public static create(attrs: ICredentialRequestPayloadCreationAttrs): CredentialRequestPayload {
    const credentialRequestPayload = new CredentialRequestPayload()
    credentialRequestPayload.credentialRequest = CredentialRequest.create(attrs.credentialRequest)
    credentialRequestPayload.typ = InteractionType.CredentialRequest

    if (attrs.iss) {
      credentialRequestPayload.iss = attrs.iss
    }

    return credentialRequestPayload
  }

  public static fromJSON(json: ICredentialRequestPayloadAttrs): CredentialRequestPayload {
    const credentialRequestPayload = plainToClass(CredentialRequestPayload, json)
    credentialRequestPayload.credentialRequest = plainToClass(CredentialRequest, json.credentialRequest)
    return credentialRequestPayload
  }

  public toJSON(): ICredentialRequestPayloadAttrs {
    return classToPlain(this) as ICredentialRequestPayloadAttrs
  }

  public getCallbackURL(): string {
    return this.credentialRequest.getCallbackURL()
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.credentialRequest.getRequestedCredentialTypes()
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return this.credentialRequest.applyConstraints(credentials)
  }
}
