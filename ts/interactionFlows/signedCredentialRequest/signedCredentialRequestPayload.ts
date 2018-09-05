import { IPayload, InteractionType } from '../types';
import { ISignedCredentialRequestAttrs } from '../../credentialRequest/signedCredentialRequest/types';
import { classToPlain, plainToClass } from 'class-transformer';
import { ISignedCredRequestPayload, ISignedCredRequestPayloadAttrs } from './types';
import { CredentialRequest } from '../../credentialRequest/credentialRequest';

export class SignedCredentialRequestPayload implements IPayload {
  public iss: string
  public iat: number
  public typ: InteractionType
  public credentialRequest: CredentialRequest

  public static fromJSON(json: ISignedCredRequestPayloadAttrs): SignedCredentialRequestPayload {
    // TODO: implement the method
    const signedCredReqPayload = plainToClass(SignedCredentialRequestPayload, json)

    return signedCredReqPayload
  }

  public toJSON(): ISignedCredentialRequestAttrs {
    return classToPlain(this) as ISignedCredentialRequestAttrs
  }

  public satisfiesConstraints() {
    // TODO: change to a real method
  }
}
