import { plainToClass, classToPlain } from 'class-transformer'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { ICredentialReceiveAttrs } from './types'

export class CredentialReceive {
  private signedCredentials: SignedCredential[]

  public static create(signedCredentials: SignedCredential[]): CredentialReceive {
    const credentialReceive = new CredentialReceive() 
    credentialReceive.signedCredentials = signedCredentials

    return credentialReceive
  }
  // TODO: optimize validation
  public async validateCredentials(did: string): Promise<boolean> {
    const res = await this.signedCredentials.map(async (cred) => {
      return await cred.validateSignature() && cred.getSubject() === did
    })
    return res[0]
  }

  public getSignedCredentials(): SignedCredential[] {
    return this.signedCredentials
  }

  public toJSON(): ICredentialReceiveAttrs {
    return classToPlain(this) as ICredentialReceiveAttrs
  }

  public static fromJSON(json: ICredentialReceiveAttrs): CredentialReceive {
    return plainToClass(CredentialReceive, json)
  }

}