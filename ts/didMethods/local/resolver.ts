import { IResolver } from "../types";
import { ErrorCodes } from "../../errors";
import { DidDocument } from "../../identity/didDocument/didDocument";
import { Identity } from "../../identity/identity";
import { getResolver } from 'local-did-resolver'
import { InternalDb } from 'local-did-resolver/js/db'
import { validateEvents } from '@jolocom/native-core-node-linux-x64'
import { DIDDocument, Resolver } from "did-resolver";

type Resolve = (did: string) => Promise<DIDDocument>

export class LocalResolver implements IResolver {
  prefix: 'un'
  db: InternalDb
  private resolveImplementation: Resolve

  //TODO figure out if this belongs here
  constructor(db: InternalDb, didDocFromValidatedEvents = validateEvents) {
    this.db = db
    this.resolveImplementation = (did: string) => new Resolver(getResolver({
      dbInstance: db,
      validateEvents: didDocFromValidatedEvents
    })).resolve(did)
  }

  async resolve(did: string) {
    const jsonDidDoc = await this.resolveImplementation(
      did,
    ).catch(e => {
      throw new Error(ErrorCodes.RegistryDIDNotAnchored)
    })

    return Identity.fromDidDocument({
      //@ts-ignore
      didDocument: DidDocument.fromJSON(jsonDidDoc)
    })
  }
}
