import { keyTypes } from '..'
import { privateKeyToDID } from '../utils/crypto'
import { IConstraint } from '../credentialRequest/types'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'

export class IdentityWallet {
  private did: string
  private privateKey: Buffer

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCred = SignedCredential.fromCredential(credential)

    signedCred.setIssuer(this.did)
    signedCred.setIssued(new Date())
    await signedCred.generateSignature(this.privateKey)

    return signedCred
  }

  // public createCredentialRequest(args: ICredentialCreationArgs): string {
  //   const req = new CredentialRequest()
  //   req.setRequesterIdentity(this.did)
  //   req.setCallbackURL(args.callbackURL)
  //   args.credentials.forEach((c) => req.addRequestedClaim(c.type, c.constraints))

  //   return req.toJWT(this.privateKey.privateKey)
  // }

  // public createCredentialResponse(credentials: ISignedCredentialAttrs[]): string {
  //   const res = new CredentialResponse().create(credentials)
  //   res.setIssuer(this.did)
  //   return res.toJWT(this.privateKey.privateKey)
  // }
}

export interface ICredentialCreationArgs {
  callbackURL: string
  credentials: Array<{type: string[], constraints: IConstraint[]}>
}
