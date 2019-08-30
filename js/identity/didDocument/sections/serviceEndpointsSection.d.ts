import 'reflect-metadata';
import { IServiceEndpointSectionAttrs } from './types';
export declare class ServiceEndpointsSection {
    protected _id: string;
    protected _type: string;
    protected _serviceEndpoint: string;
    protected _description: string;
    id: string;
    type: string;
    serviceEndpoint: string;
    description: string;
    toJSON(): IServiceEndpointSectionAttrs;
    static fromJSON(json: IServiceEndpointSectionAttrs): ServiceEndpointsSection;
}
export declare const generatePublicProfileServiceSection: (did: string, profileIpfsHash: string) => ServiceEndpointsSection;
