import { plainToClass, classToPlain } from 'class-transformer'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { ICredentialReceiveAttrs } from './types'

export class CredentialReceive {
  public signedCredentials: SignedCredential[]

  public static create(signedCredentials: SignedCredential[]): CredentialReceive {
    const credentialReceive = new CredentialReceive() 
    credentialReceive.signedCredentials = signedCredentials

    return credentialReceive
  }
  // TODO: add method
  // public async validateCredentials(did: string): Promise<boolean> {
  // }

  public getSignedCredentials(): SignedCredential[] {
    return this.signedCredentials
  }

  public toJSON(): ICredentialReceiveAttrs {
    return classToPlain(this) as ICredentialReceiveAttrs
  }

  public static fromJSON(json: ICredentialReceiveAttrs): CredentialReceive {
    const credentialReceive = plainToClass(CredentialReceive, json)
    credentialReceive.signedCredentials = plainToClass(SignedCredential, json.signedCredentials )

    return credentialReceive
  }

}