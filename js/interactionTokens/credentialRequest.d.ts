import { ICredentialRequestAttrs, IExposedConstraintFunctions, ICredentialRequest } from './interactionTokens.types';
import { ISignedCredentialAttrs } from '../credentials/types';
export declare class CredentialRequest {
    private _callbackURL;
    private _credentialRequirements;
    credentialRequirements: ICredentialRequest[];
    callbackURL: string;
    readonly requestedCredentialTypes: string[][];
    applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[];
    toJSON(): ICredentialRequestAttrs;
    static fromJSON(json: ICredentialRequestAttrs): CredentialRequest;
}
export declare const constraintFunctions: IExposedConstraintFunctions;
