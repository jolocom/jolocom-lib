import 'reflect-metadata'
import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IServiceEndpointSectionAttrs } from './types'

/*
 * Class representing a DidDocument Service Endpoint section
 * see: https://w3c-ccg.github.io/did-spec/#service-endpoints
 */

@Exclude()
export class ServiceEndpointsSection {
  @Expose()
  private id: string

  @Expose()
  private type: string

  @Expose()
  private serviceEndpoint: string

  @Expose()
  private description: string

  public getId(): string {
    return this.id
  }

  public getDescription(): string {
    return this.description
  }

  public getType(): string {
    return this.type
  }

  public getEndpoint(): string {
    return this.serviceEndpoint
  }

  public setId(id: string) {
    this.id = id
  }

  public setDescription(description: string) {
    this.description = description
  }

  public setType(type: string) {
    this.type = type
  }

  public setEndpoint(endpoint: string) {
    this.serviceEndpoint = endpoint
  }

  public toJSON(): IServiceEndpointSectionAttrs {
    return classToPlain(this) as IServiceEndpointSectionAttrs
  }

  public static fromJSON(json: IServiceEndpointSectionAttrs): ServiceEndpointsSection {
    return plainToClass(ServiceEndpointsSection, json)
  }
}

/*
 * Class representing a specialized service endpoint entry configuration pointing
 *   to a Jolocom public profile credential.
 * see: https://w3c-ccg.github.io/did-spec/#service-endpoints
 */

export class PublicProfileServiceEndpoint extends ServiceEndpointsSection {

  /*
  * @description - Instantiates class based on passed arguments
  * @param did - The did of the did document owner
  * @param pubProfIpfsHash - IPFS hash that can be used to dereference
  *   the public profile credential
  * @returns {Object} - Populated service endpoint entry instance
  */

  public static create(did: string, pubProfIpfsHash: string) {
    const PubProfSec = new PublicProfileServiceEndpoint()
    PubProfSec.setId(`${did};jolocomPubProfile`)
    PubProfSec.setEndpoint(`ipfs://${pubProfIpfsHash}`)
    PubProfSec.setDescription('Verifiable Credential describing entity profile')
    PubProfSec.setType('JolocomPublicProfile')
    return PubProfSec
  }
}
