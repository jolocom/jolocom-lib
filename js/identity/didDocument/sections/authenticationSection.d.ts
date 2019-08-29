import { IAuthenticationSectionAttrs } from './types';
import { PublicKeySection } from './publicKeySection';
export declare class AuthenticationSection {
    private _publicKey;
    private _type;
    publicKey: string;
    type: string;
    static fromEcdsa(publicKeySection: PublicKeySection): AuthenticationSection;
    toJSON(): IAuthenticationSectionAttrs;
    fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection;
}
