import { plainToClass, classToPlain } from 'class-transformer'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { ICredentialReceiveAttrs } from './types'

// TODO: check if validation function is needed??
export class CredentialReceive {
  private signedCredential: SignedCredential

  public static create(signedCredential: SignedCredential): CredentialReceive {
    const credentialReceive = new CredentialReceive() 
    credentialReceive.signedCredential = signedCredential

    return credentialReceive
  }

  public getSignedCredential(): SignedCredential {
    return this.signedCredential
  }

  public toJSON(): ICredentialReceiveAttrs {
    return classToPlain(this) as ICredentialReceiveAttrs
  }

  public static fromJSON(json: ICredentialReceiveAttrs): CredentialReceive {
    return plainToClass(CredentialReceive, json)
  }

}