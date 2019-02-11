/// <reference types="node" />
import { IDidDocumentAttrs } from './types';
import { AuthenticationSection, PublicKeySection, ServiceEndpointsSection } from './sections';
import { ISigner } from '../../registries/types';
import { ContextEntry } from 'cred-types-jolocom-core';
import { ILinkedDataSignature, IDigestable } from '../../linkedDataSignature/types';
export declare class DidDocument implements IDigestable {
    private _id;
    private _authentication;
    private _publicKey;
    private _service;
    private _created;
    private _proof;
    private '_@context';
    context: ContextEntry[];
    did: string;
    authentication: AuthenticationSection[];
    publicKey: PublicKeySection[];
    service: ServiceEndpointsSection[];
    created: Date;
    readonly signer: ISigner;
    signature: string;
    proof: ILinkedDataSignature;
    addAuthSection(section: AuthenticationSection): void;
    addPublicKeySection(section: PublicKeySection): void;
    addServiceEndpoint(endpoint: ServiceEndpointsSection): void;
    resetServiceEndpoints(): void;
    static fromPublicKey(publicKey: Buffer): DidDocument;
    private prepareSignature;
    digest(): Promise<Buffer>;
    normalize(): Promise<string>;
    toJSON(): IDidDocumentAttrs;
    static fromJSON(json: IDidDocumentAttrs): DidDocument;
}
