import { DidDocument } from './didDocument/didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { AuthenticationSection, PublicKeySection, ServiceEndpointsSection } from './didDocument/sections'
import { PublicKey } from './types'
import { keyIdToNumber, keyNumberToKeyId } from '../utils/helper'
import { publicKeyToDID } from '../utils/crypto'
import { generatePublicProfileServiceSection } from './didDocument/sections/serviceEndpointsSection'

/**
 * @class
 * Class representing an identity, combines a {@link DidDocument} and a public profile {@link SignedCredential}
 */

export class Identity {
  public did: string
  public publicKey: PublicKey
  public recoveryKey?: PublicKey
  public services?: ServiceEndpointsSection[]
  public created: Date
  public updated: Date

  public get publicProfileCredential(): SignedCredential {
    const publicProfile = this.services.find(
      s => s.type == 'JolocomPublicProfile',
    )
    if (publicProfile) return publicProfile.serviceEndpoint as SignedCredential
  }

  public set publicProfileCredential(publicProfile: SignedCredential) {
    this.services.push(
      generatePublicProfileServiceSection(this.did, publicProfile),
    )
  }

  /**
   * Create the Identity object based on identity data. DID and public key are required.
   * @param did - DID of the identity object
   * @param publicKey - current owner public key
   * @param recoveryKey - recovery key to recovery the users DID in case of
   * @param serviceSection - service section
   * @param created - Date when the identity has been created
   * @param updated - Date when the identity has last been updated
   */
  public constructor(
    did: string,
    publicKey: PublicKey,
    recoveryKey?: PublicKey,
    serviceSection: ServiceEndpointsSection[] = [],
    created?: Date,
    updated?: Date,
  ) {
    this.did = did
    this.publicKey = publicKey
    this.recoveryKey = recoveryKey
    this.services = serviceSection
    this.created = created
    this.updated = updated
  }

  public static create(publicKey: Buffer): Identity {
    const did = publicKeyToDID(publicKey)
    return new Identity(did, {
      hexValue: publicKey.toString('hex'),
      keyId: 1,
    })
  }

  /**
   * Instantiates the {@link Identity} class based on a did document and public profile
   * @param didDocument - The did document associated with a did
   * @example `const identity = Identity.fromDidDocument({didDocument, publicProfile})`
   */

  public static fromDidDocument(didDocument: DidDocument): Identity {
    const ownerKey = didDocument.publicKey.find(
      p => p.id == didDocument.authentication[0].publicKey,
    )
    // const recoveryKey = didDocument.publicKey.find(
    //   p => p.id == didDocument.authorization[0].publicKey,
    // )
    return new Identity(
      didDocument.did,
      {
        hexValue: ownerKey.publicKeyHex,
        keyId: keyIdToNumber(ownerKey.id),
      },
      null, // TODO add once authorization is finished
      didDocument.service,
      didDocument.created,
    )
  }

  public toDidDocument(): DidDocument {
    const didDocument = new DidDocument()
    didDocument.did = this.did
    didDocument.addPublicKeySection(
      PublicKeySection.fromEcdsa(
        Buffer.from(this.publicKey.hexValue, 'hex'),
        keyNumberToKeyId(this.publicKey.keyId, this.did),
        this.did,
      ),
    )
    didDocument.addAuthSection(
      AuthenticationSection.fromEcdsa(didDocument.publicKey[0]),
    )
    if (this.recoveryKey) {
      didDocument.addPublicKeySection(
        PublicKeySection.fromEcdsa(
          Buffer.from(this.recoveryKey.hexValue, 'hex'),
          keyNumberToKeyId(this.recoveryKey.keyId, this.did),
          this.did,
        ),
      )
      //TODO add authorization section
    }
    didDocument.service = this.services
    if (this.created) didDocument.created = this.created
    return didDocument
  }
}
