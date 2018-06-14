import { IPrivateKey } from './types'
import { keyTypes } from '..'
import { privateKeyToDID } from '../utils/crypto'
import { CredentialRequest } from '../credentialRequest'
import { IConstraint } from '../credentialRequest/types'
import { CredentialResponse } from '../credentialResponse'
import { Credential } from '../credentials/credential'
import { SignedCredential } from '../credentials/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'

export class IdentityWallet {
  private did: string
  private privateKey: IPrivateKey

  // TODO Be smarter
  public fromPrivateKey(privateKey: Buffer, path?: keyTypes | string): IdentityWallet {
    const wallet = new IdentityWallet()
    wallet.did = privateKeyToDID(privateKey)
    wallet.privateKey = {
      id: 'keys-1',
      path: path ? path : keyTypes.jolocomIdentityKey,
      privateKey
    }

    return wallet
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCred = new SignedCredential().fromCredential(credential)

    signedCred.setIssuer(this.did)
    signedCred.setIssued(new Date())
    await signedCred.generateSignature(this.privateKey)

    return signedCred
  }

  public createCredentialRequest(args: ICredentialCreationArgs): string {
    const req = new CredentialRequest()
    req.setRequesterIdentity(this.did)
    req.setCallbackURL(args.callbackURL)
    args.credentials.forEach((c) => req.addRequestedClaim(c.type, c.constraints))

    return req.toJWT(this.privateKey.privateKey)
  }

  public createCredentialResponse(credentials: ISignedCredentialAttrs[]): string {
    const res = new CredentialResponse().create(credentials)
    res.setIssuer(this.did)
    return res.toJWT(this.privateKey.privateKey)
  }
}

export interface ICredentialCreationArgs {
  callbackURL: string
  credentials: Array<{type: string[], constraints: IConstraint[]}>
}
