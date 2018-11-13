import 'reflect-metadata'
import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IServiceEndpointSectionAttrs } from './types'

/**
 * Class representing a DidDocument Service Endpoint section
 * see: https://w3c-ccg.github.io/did-spec/#service-endpoints
 */

@Exclude()
export class ServiceEndpointsSection {
  protected _id: string
  protected _type: string
  protected _serviceEndpoint: string
  protected _description: string

  @Expose()
  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  @Expose()
  get type(): string {
    return this._type
  }

  set type(type: string) {
    this._type = type
  }

  @Expose()
  get serviceEndpoint() {
    return this._serviceEndpoint
  }

  set serviceEndpoint(service: string) {
    this._serviceEndpoint = service
  }

  @Expose()
  get description() {
    return this._description
  }

  set description(description: string) {
    this._description = description
  }

  public toJSON(): IServiceEndpointSectionAttrs {
    return classToPlain(this) as IServiceEndpointSectionAttrs
  }

  public static fromJSON(json: IServiceEndpointSectionAttrs): ServiceEndpointsSection {
    return plainToClass(ServiceEndpointsSection, json)
  }
}

/**
 * Class representing a specialized service endpoint entry configuration pointing
 *   to a Jolocom public profile credential.
 * see: https://w3c-ccg.github.io/did-spec/#service-endpoints
 */

/**
 * @description - Instantiates class based on passed arguments
 * @param did - The did of the did document owner
 * @param pubProfIpfsHash - IPFS hash that can be used to dereference
 *   the public profile credential
 * @returns {Object} - Populated service endpoint entry instance
 */
export const generatePublicProfileServiceSection = (did: string, profileIpfsHash: string): ServiceEndpointsSection => {
  const PubProfSec = new ServiceEndpointsSection()
  PubProfSec.id = `${did};jolocomPubProfile`
  PubProfSec.serviceEndpoint = `ipfs://${profileIpfsHash}`
  PubProfSec.description = 'Verifiable Credential describing entity profile'
  PubProfSec.type = 'JolocomPublicProfile'
  return PubProfSec
}
