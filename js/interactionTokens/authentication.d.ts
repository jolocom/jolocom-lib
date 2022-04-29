import { IAuthenticationAttrs } from './interactionTokens.types';
export declare class Authentication {
    private _callbackURL;
    private _description;
    get callbackURL(): string;
    set callbackURL(callbackURL: string);
    get description(): string;
    set description(description: string);
    toJSON(): Record<string, any>;
    static fromJSON(json: IAuthenticationAttrs): Authentication;
}
