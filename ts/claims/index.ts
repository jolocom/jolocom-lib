import VerifiableCredential from './verifiableCredential'
import { IClaim } from './types'

export default class Claims {
  public createVerifiableCredential(issuer: string, credentialType: string[], claim: IClaim) : VerifiableCredential {
    return new VerifiableCredential(credentialType, issuer, claim)
  }

  public createVerifiedCredential(issuer: string, credentialType: string[], claim: IClaim, privateKeyWIF: string) :
  {credential: VerifiableCredential, signature: string} {
    return VerifiableCredential.createVerified(issuer, credentialType, claim, privateKeyWIF)
  }

  public verifySignedCredential(credential: VerifiableCredential, signature: string, publicKeyOfIssuer: string) :
  boolean {
    return credential.verifySignedCredential(signature, publicKeyOfIssuer)
  }
}
