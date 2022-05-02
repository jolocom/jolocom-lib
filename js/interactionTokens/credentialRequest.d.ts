import { ICredentialRequestAttrs, IExposedConstraintFunctions, ICredentialRequest } from './interactionTokens.types';
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';
export declare class CredentialRequest {
    private _callbackURL;
    private _credentialRequirements;
    get credentialRequirements(): ICredentialRequest[];
    set credentialRequirements(requirements: ICredentialRequest[]);
    get callbackURL(): string;
    set callbackURL(callback: string);
    get requestedCredentialTypes(): string[][];
    applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[];
    toJSON(): ICredentialRequestAttrs;
    static fromJSON(json: ICredentialRequestAttrs): CredentialRequest;
}
export declare const constraintFunctions: IExposedConstraintFunctions;
