import * as chai from "chai";
import { SignedCredential } from "../../../ts/credentials/v1.1/signedCredential";
import { CredentialSigner } from "../../../ts/credentials/v1.1/credentialBuilder";
import { CredentialVerifier } from "../../../ts/credentials/v1.1/credentialVerifier";
import { example1, example3 } from "../../data/credential/signedCredential.data";
import { expect } from "chai";
import { mockEmailCredCreationAttrs } from "../../data/credential/credential.data";
import { LocalDidMethod } from "../../../ts/didMethods/local";
import { SupportedSuites } from "../../../ts/linkedDataSignature";
import { Credential } from "../../../ts/credentials/v1.1/credential";

chai.use(require("sinon-chai"));

describe.only("VC Builder tests", () => {
  it("Creates a simple example from JSON", async () => {
    const builder = CredentialSigner.fromSignedCredential(
      //@ts-ignore TODO #1 PROTOCOL TS CHANGES need to be published
      SignedCredential.fromJSON(example1)
    );

    const { identityWallet } = await new LocalDidMethod().recoverFromSeed(
      Buffer.from("000102030405060708090a0b0c0d0e0f", "hex"),
      "pass"
    );

    const p1 = await builder.generateProof(
      SupportedSuites.Ed25519Signature2018,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {},
      },
      identityWallet,
      "pass"
    );

    const p2 = await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: p1,
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
        },
      },
      identityWallet,
      "pass"
    );

    const p3 = await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: p2,
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
        },
      },
      identityWallet,
      "pass"
    );

    await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          previousProof: p3,
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
        },
      },
      identityWallet,
      "pass"
    );

    const verifier = new CredentialVerifier([identityWallet]);

    const vc = builder.toSignedCredential();
    const verificationResults = await verifier.verifyAllProofs(vc)

    expect(verificationResults[0].valid).to.eq(true);
    expect(verificationResults[1].valid).to.eq(true);
    expect(verificationResults[2].valid).to.eq(true);
    expect(verificationResults[3].valid).to.eq(true);

    expect(verificationResults[1].referencedProofValid).to.eq(true);
    expect(verificationResults[2].referencedProofValid).to.eq(true);
    expect(verificationResults[3].referencedProofValid).to.eq(true);


    vc.id = "dsadsa";

    const resultsAfterModification = await verifier.verifyAllProofs(vc)

    expect(resultsAfterModification[0].valid).to.eq(false);
    expect(resultsAfterModification[1].valid).to.eq(true);
    expect(resultsAfterModification[2].valid).to.eq(true);
    expect(resultsAfterModification[3].valid).to.eq(true);

    expect(resultsAfterModification[1].referencedProofValid).to.eq(false);
    expect(resultsAfterModification[2].referencedProofValid).to.eq(false);
    expect(resultsAfterModification[3].referencedProofValid).to.eq(false);
  });

  it("Creates a simple example", async () => {
    const { identityWallet } = await new LocalDidMethod().recoverFromSeed(
      Buffer.from("000102030405060708090a0b0c0d0e0f", "hex"),
      "pass"
    );

    const credential = Credential.build(mockEmailCredCreationAttrs);
    const builder = CredentialSigner.fromCredential(credential);

    const [issued, expires] = getIssuanceExpiryDates();
    builder.setDates(issued, expires);
    builder.setIssuer(identityWallet.publicKeyMetadata.signingKeyId);

    const edProof = await builder.generateProof(
      SupportedSuites.EcdsaKoblitzSignature2016,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: undefined,
      },
      identityWallet,
      "pass"
    );

    await builder.generateProof(
      SupportedSuites.ChainedProof2021,
      {
        proofOptions: {
          verificationMethod: identityWallet.publicKeyMetadata.signingKeyId,
        },
        proofSpecificOptions: {
          chainSignatureSuite: SupportedSuites.EcdsaKoblitzSignature2016,
          previousProof: edProof,
        },
      },
      identityWallet,
      "pass"
    );

    const verifier = new CredentialVerifier([identityWallet]);

    const vc = builder.toSignedCredential();
    const verificationResults = await verifier.verifyAllProofs(vc)
    expect(verificationResults[0].valid).to.eq(true);
    expect(verificationResults[1].valid).to.eq(true);
    expect(verificationResults[1].referencedProofValid).to.eq(true);

    console.log({verificationResults})

    vc.expires = new Date();

    const resultsAfterModification = await verifier.verifyAllProofs(vc)
    expect(resultsAfterModification[0].valid).to.eq(false);
    expect(resultsAfterModification[1].valid).to.eq(true);
    expect(resultsAfterModification[1].referencedProofValid).to.eq(false);
    console.log({resultsAfterModification})
  });
});

const getIssuanceExpiryDates = () => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 5);

  const issued = new Date();

  return [issued, expires];
};
