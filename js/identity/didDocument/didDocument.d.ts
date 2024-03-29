/// <reference types="node" />
import { IDidDocumentAttrs } from '@jolocom/protocol-ts';
import { AuthenticationSection, PublicKeySection, ServiceEndpointsSection } from './sections';
import { IDigestable, ILinkedDataSignature } from '../../linkedDataSignature/types';
import { ContextEntry } from '@jolocom/protocol-ts';
import { ISigner } from '../../credentials/signedCredential/types';
import { IVaultedKeyProvider, IKeyRefArgs } from '@jolocom/vaulted-key-provider';
export declare class DidDocument implements IDigestable {
    private _id;
    private _specVersion;
    private _authentication;
    private _publicKey;
    private _service;
    private _created;
    private _updated;
    private _proof;
    private _context;
    get specVersion(): number;
    set specVersion(specVersion: number);
    get context(): ContextEntry[];
    set context(context: ContextEntry[]);
    get did(): string;
    set did(did: string);
    get authentication(): AuthenticationSection[];
    set authentication(authentication: AuthenticationSection[]);
    get publicKey(): PublicKeySection[];
    set publicKey(value: PublicKeySection[]);
    findPublicKeySectionById(keyId: string): PublicKeySection;
    get service(): ServiceEndpointsSection[];
    set service(service: ServiceEndpointsSection[]);
    get created(): Date;
    set created(value: Date);
    get updated(): Date;
    set updated(value: Date);
    get signer(): ISigner;
    get signature(): string;
    set signature(signature: string);
    get proof(): ILinkedDataSignature;
    set proof(proof: ILinkedDataSignature);
    addAuthKeyId(authenticationKeyId: string): void;
    addAuthKey(authenticationKey: PublicKeySection): void;
    addPublicKeySection(section: PublicKeySection): void;
    addServiceEndpoint(endpoint: ServiceEndpointsSection): void;
    resetServiceEndpoints(): void;
    static fromPublicKey(publicKey: Buffer): Promise<DidDocument>;
    sign(vaultedKeyProvider: IVaultedKeyProvider, signConfig: IKeyRefArgs): Promise<void>;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    hasBeenUpdated(): void;
    toJSON(): IDidDocumentAttrs;
    static fromJSON(json: IDidDocumentAttrs): DidDocument;
}
