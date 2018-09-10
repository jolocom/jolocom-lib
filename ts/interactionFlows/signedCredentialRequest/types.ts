import { CredentialRequest } from '../../credentialRequest/credentialRequest';
import { InteractionType, IPayload, IPayloadAttrs } from '../types';
import { ICredentialRequestAttrs, IConstraint } from '../../credentialRequest/types';

export interface ISignedCredRequestPayload extends IPayload {
  iat: number
  iss: string
  typ: InteractionType
  credentialRequest: CredentialRequest
}

export interface ISignedCredRequestPayloadAttrs extends IPayloadAttrs {
  iat: number
  iss: string
  typ: string
  credentialRequest: ICredentialRequestCreationAttrs
}

export type requestedCredentialAttrs = Array<{type: string[], constraints: IConstraint[]}>

export interface ICredentialRequestCreationAttrs {
  callbackURL: string
  credentialRequirements: requestedCredentialAttrs
}
