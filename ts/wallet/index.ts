import { IPrivateKey } from './types'
import { keyTypes } from '..'
import { privateKeyToDID } from '../utils/crypto'
import { Credential } from '../credentials/credential'
import { VerifiableCredential } from '../credentials/verifiableCredential'
import { CredentialRequest } from '../credentialRequest'

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

  public async signCredential(credential: Credential): Promise<VerifiableCredential> {
    const vc = new VerifiableCredential().fromCredential(credential)

    vc.setIssuer(this.did)
    vc.setIssued(new Date())
    await vc.generateSignature(this.privateKey)

    return vc
  }

  public createCredentialRequest(): CredentialRequest {
    return new CredentialRequest()
  }
}
