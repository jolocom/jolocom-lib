import { utils } from 'web3'

/* Creates Identity id according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class Did {
  public static fromJSON(json: string): Did {
    const did = Object.create(Did.prototype);
    return Object.assign(did, {
      identifier: json,
    });
  }

  public identifier: string;

  constructor(publicKey: Buffer) {
    const prefix = "did:jolo:";
    const suffix = utils.soliditySha3(publicKey)
    this.identifier = prefix + suffix;
  }

  public toJSON(): string {
    return this.identifier;
  }
}
