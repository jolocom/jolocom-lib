import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { CredentialResponse } from '../../interactionFlows/credentialResponse/credentialResponse'
import {
  ICredentialResponsePayloadAttrs,
  ISuppliedCredentialsAttrs,
  ICredentialResponsePayloadCreationAttrs
} from './types'

export class CredentialResponsePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialResponse: CredentialResponse

  public static create(attrs: ICredentialResponsePayloadCreationAttrs): CredentialResponsePayload {
    if (attrs.typ !== InteractionType.CredentialResponse) {
      throw new Error('Incorrect payload for CredentialResponse')
    }
    const credentialResponsePayload = new CredentialResponsePayload()
    console.log(Array.isArray(attrs.credentialResponse), 'attrs in create method')
    console.log(attrs.credentialResponse)
    // console.log(CredentialResponse.create(attrs.credentialResponse))
    // credentialResponsePayload.credentialResponse = CredentialResponse.create(attrs)
    // console.log(credentialResponsePayload.credentialResponse)
    // plainToClass(CredentialResponse, attrs.credentialResponse)
    // console.log(CredentialResponse.create(attrs.credentialResponse))
    // console.log(plainToClass(CredentialResponse, attrs.credentialResponse), 'plain to class')
    // console.log(credentialResponsePayload.credentialResponse, 'payload in CR')
    credentialResponsePayload.typ = InteractionType.CredentialResponse

    return credentialResponsePayload
  }

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
