import { plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { publicKeyToDID, privateKeyToDID, privateKeyToPublicKey } from '../../utils/crypto'
import { IDidDocumentAttrs } from './types'
import { AuthenticationSection } from './sections/authenticationSection'
import { ServiceEndpointsSection } from './sections/serviceEndpointsSection'
import { PublicKeySection } from './sections/publicKeySection'

@Exclude()
export class DidDocument {
  @Type(() => AuthenticationSection)
  @Expose()
  private authentication: AuthenticationSection[] = []

  @Type(() => PublicKeySection)
  @Expose()
  private publicKey: PublicKeySection[] = []

  @Type(() => ServiceEndpointsSection)
  @Expose()
  private service: ServiceEndpointsSection[] = []

  @Type(() => Date)
  @Expose()
  private created: Date

  @Expose()
  private '@context': string = 'https://w3id.org/did/v1'

  @Expose()
  private id: string

  public fromPrivateKey(privateKey: Buffer): DidDocument {
    const did = privateKeyToDID(privateKey)
    const publicKey = privateKeyToPublicKey(privateKey)

    const keyId = `${did}#keys-1`
    const publicKeySection = new PublicKeySection().fromEcdsa(publicKey, keyId)
    const authenticationSection = new AuthenticationSection().fromEcdsa(publicKeySection)

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

  public getServiceEndpoints(): ServiceEndpointsSection[] {
    return this.service
  }

  public getPublicKeySection() {
    return this.publicKey
  }

  public toJSON(): IDidDocumentAttrs {
    return classToPlain(this) as IDidDocumentAttrs
  }

  public static fromJSON(json: IDidDocumentAttrs): DidDocument {
    return plainToClass(DidDocument, json)
  }
}
