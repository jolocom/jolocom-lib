export * from '@jolocom/protocol-ts/dist/lib/credential';
export * from '@jolocom/protocol-ts/dist/lib/signedCredential';
export interface ISigner {
    did: string;
    keyId: string;
}
