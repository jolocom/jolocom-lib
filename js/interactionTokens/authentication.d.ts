import { IAuthenticationAttrs } from './interactionTokens.types';
export declare class Authentication {
    private _callbackURL;
    private _description;
    callbackURL: string;
    description: string;
    toJSON(): Record<string, any>;
    static fromJSON(json: IAuthenticationAttrs): Authentication;
}
