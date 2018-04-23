import { plainToClass, classToPlain, Type } from 'class-transformer'
import { publicKeyToDID } from '../../utils/crypto'
import { IDidDocument } from './types'
import { AuthenticationSection } from './sections/authenticationSection'
import { PublicKeySection } from './sections/publicKeySection'

export class DidDocument  {
  @Type(() => AuthenticationSection)
  private authentication: AuthenticationSection[] = []

  @Type(() => PublicKeySection)
  private publicKey: PublicKeySection[] = []

  @Type(() => Date)
  private created: Date

  private '@context': string = 'https://w3id.org/did/v1'
  private id: string

  public fromPublicKey(publicKey: Buffer): DidDocument {
    const did = publicKeyToDID(publicKey)
    // TODO Be smarter
    const keyId = `${did}#keys-1`
    const publicKeySection = new PublicKeySection().fromEcdsa(publicKey, keyId)
    const authenticationSection = new AuthenticationSection()
      .fromEcdsa(publicKeySection)

    const didDocument = new DidDocument()
    didDocument.created = new Date()
    didDocument.id = did
    didDocument.publicKey.push(publicKeySection)
    didDocument.authentication.push(authenticationSection)

    return didDocument
  }

  public getDID(): string {
    return this.id
  }

  public toJSON(): IDidDocument {
    return classToPlain(this) as IDidDocument
  }

  public fromJSON(json: IDidDocument): DidDocument {
    return plainToClass(DidDocument, json)
  }
}
