import 'reflect-metadata'
import {
  classToPlain,
  plainToClass,
  Exclude,
  Expose,
  Type,
} from 'class-transformer'
import { IServiceEndpointSectionAttrs } from './types'
import { SignedCredential } from '../../../credentials/signedCredential/signedCredential'

/**
 * Class modelling a Did Document Service Endpoint section
 * @memberof {@link DidDocument}
 * @see {@link https://w3c-ccg.github.io/did-spec/#service-endpoints | specification}
 * @internal
 * @ignore
 */

@Exclude()
export class ServiceEndpointsSection {
  protected _id: string
  protected _type: string
  protected _serviceEndpoint: string | SignedCredential
  protected _description: string

  /**
   * Get the the service endpoint identifier
   */

  @Expose()
  get id(): string {
    return this._id
  }

  /**
   * Set the the service endpoint identifier
   */

  set id(id: string) {
    this._id = id
  }

  /**
   * Get the the service endpoint type
   */

  @Expose()
  get type(): string {
    return this._type
  }

  /**
   * Set the the service endpoint type
   */

  set type(type: string) {
    this._type = type
  }

  /**
   * Get the the service endpoint
   */

  @Expose()
  @Type(() => SignedCredential)
  public get serviceEndpoint(): string | SignedCredential {
    return this._serviceEndpoint
  }

  /**
   * Set the the service endpoint
   */

  public set serviceEndpoint(service: string | SignedCredential) {
    this._serviceEndpoint = service
  }

  /**
   * Get the the service endpoint description
   */

  @Expose()
  get description() {
    return this._description
  }

  /**
   * Set the the service endpoint description
   */

  set description(description: string) {
    this._description = description
  }

  /**
   * Serializes the {@link ServiceEndpointsSection} as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public toJSON(): IServiceEndpointSectionAttrs {
    return classToPlain(this) as IServiceEndpointSectionAttrs
  }

  /**
   * Instantiates an {@link ServiceEndpointsSection} from it's JSON form
   * @param json - Section encoded as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public static fromJSON(
    json: IServiceEndpointSectionAttrs,
  ): ServiceEndpointsSection {
    return plainToClass(ServiceEndpointsSection, json)
  }
}

/**
 * Instantiates the {@link ServiceEndpointsSection} class based on passed arguments
 * @param did - The did of the did document owner
 * @param publicProfile - public profile credential
 * @internal
 */

export const generatePublicProfileServiceSection = (
  did: string,
  publicProfile: SignedCredential,
): ServiceEndpointsSection => {
  const PubProfSec = new ServiceEndpointsSection()
  PubProfSec.id = `${did};jolocomPubProfile`
  PubProfSec.serviceEndpoint = publicProfile
  PubProfSec.description = 'Verifiable Credential describing entity profile'
  PubProfSec.type = 'JolocomPublicProfile'
  return PubProfSec
}
