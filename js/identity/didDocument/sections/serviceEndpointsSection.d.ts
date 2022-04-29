import 'reflect-metadata';
import { IServiceEndpointSectionAttrs } from '@jolocom/protocol-ts';
export declare class ServiceEndpointsSection {
    protected _id: string;
    protected _type: string;
    protected _serviceEndpoint: string;
    protected _description: string;
    get id(): string;
    set id(id: string);
    get type(): string;
    set type(type: string);
    get serviceEndpoint(): string;
    set serviceEndpoint(service: string);
    get description(): string;
    set description(description: string);
    toJSON(): IServiceEndpointSectionAttrs;
    static fromJSON(json: IServiceEndpointSectionAttrs): ServiceEndpointsSection;
}
export declare const generatePublicProfileServiceSection: (did: string, profileIpfsHash: string) => ServiceEndpointsSection;
