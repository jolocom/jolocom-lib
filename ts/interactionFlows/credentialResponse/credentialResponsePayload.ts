import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { CredentialResponse } from './credentialResponse';
import { ICredentialResponsePayloadAttrs, ISuppliedCredentialsAttrs } from './types';

export class CredentialResponsePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialResponse: CredentialResponse

  public static fromJSON(json: ICredentialResponsePayloadAttrs): CredentialResponsePayload {
    const credentialResponsePayload = plainToClass(CredentialResponsePayload, json)
    credentialResponsePayload.credentialResponse = plainToClass(CredentialResponse, json.credentialResponse)

    return credentialResponsePayload
  }

  public toJSON(): ICredentialResponsePayloadAttrs {
    return classToPlain(this) as ICredentialResponsePayloadAttrs
  }

  public getSuppliedCredentials(): ISuppliedCredentialsAttrs[] {
    return this.credentialResponse.getSuppliedCredentials()
  }
}
