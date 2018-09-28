import { IPayload, InteractionType } from '../types'
import { classToPlain, plainToClass } from 'class-transformer'
import { CredentialResponse } from '../../interactionFlows/credentialResponse/credentialResponse'
import {
  ICredentialResponsePayloadAttrs,
  ICredentialResponsePayloadCreationAttrs
} from './types'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export class CredentialResponsePayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialResponse: CredentialResponse

  public static create(attrs: ICredentialResponsePayloadCreationAttrs): CredentialResponsePayload {
    if (attrs.typ !== InteractionType.CredentialResponse) {
      throw new Error('Incorrect payload for CredentialResponse')
    }
   const credResponsePayload = new CredentialResponsePayload()
    credResponsePayload.credentialResponse = CredentialResponse.create(attrs.credentialResponse)
    credResponsePayload.typ = InteractionType.CredentialResponse

    return credResponsePayload
  }

  public static fromJSON(json: ICredentialResponsePayloadAttrs): CredentialResponsePayload {
    const credResponsePayload = plainToClass(CredentialResponsePayload, json)
    credResponsePayload.credentialResponse = plainToClass(CredentialResponse, json.credentialResponse)
    credResponsePayload.credentialResponse.suppliedCredentials = json.credentialResponse
      .suppliedCredentials
      .map((sCred) => plainToClass(SignedCredential, sCred))

    return credResponsePayload
  }

  public toJSON(): ICredentialResponsePayloadAttrs {
    return classToPlain(this) as ICredentialResponsePayloadAttrs
  }

  public getSuppliedCredentials(): SignedCredential[] {
    return this.credentialResponse.getSuppliedCredentials()
  }
}
