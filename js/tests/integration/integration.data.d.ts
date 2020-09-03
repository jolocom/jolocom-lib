/// <reference types="node" />
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare const testEthereumConfig: {
    providerUrl: string;
    contractAddress: string;
};
export declare const testIpfsConfig: {
    protocol: string;
    port: number;
    host: string;
};
export declare const deployerEthKey = "0x18e12d1ddf1275201ab20f50dbcc2b7cd6ff21653cc6ac0acd01414862d265c7";
export declare const userSeed: Buffer;
export declare const userPass: string;
export declare const getNewVault: (id: string, pass: string) => Promise<SoftwareKeyProvider>;
export declare const userEthKey = "0x58b03b7b5a44f763fa3387dd68dc9552b31ebff0086fd9d85a202f960e46f315";
export declare const servicePass: string;
export declare const serviceEthKey = "0x0290c9f6e4f73dd5718674493b69956f3d65969acaf7205478c20ae4086f5df2";
export declare const integrationCredRequestJSON: {
    callbackURL: string;
    credentialRequirements: {
        type: string[];
        constraints: any[];
    }[];
};
export declare const emailCredJSON: {
    metadata: import("@jolocom/protocol-ts").EmailClaimMetadata;
    subject: string;
    claim: {
        email: string;
    };
};
