import { IAuthenticationAttrs } from './interactionTokens.types';
export declare class Authentication {
    private _callbackURL;
    callbackURL: string;
    toJSON(): Object;
    static fromJSON(json: IAuthenticationAttrs): Authentication;
}
