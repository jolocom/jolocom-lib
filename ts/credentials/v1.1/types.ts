import { IClaimSection, JsonLdObject } from "@jolocom/protocol-ts";

export interface SignedCredentialJSON extends JsonLdObject {
    id: string;
    type: string[];
    issuer: string;
    expires?: string;
    credentialSubject: IClaimSection | IClaimSection[]
    proof: Record<string, string> | Array<Record<string, string>>
}
