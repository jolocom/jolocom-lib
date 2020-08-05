import { IResolver } from "../types";
import { ErrorCodes } from "../../errors";
import { DidDocument } from "../../identity/didDocument/didDocument";
import { Identity } from "../../identity/identity";
import { getResolver } from 'local-did-resolver'
import { InternalDb } from 'local-did-resolver/js/db'
import { validateEvents } from '@jolocom/native-utils-node'
import { DIDDocument, Resolver } from "did-resolver";

// TODO
type Resolve = (did: string) => Promise<DIDDocument>

export class LocalResolver implements IResolver {
  prefix: 'jolo'
  db: InternalDb
  private resolveImplementation: Resolve

  //TODO figure out if this belongs here
  constructor(db: InternalDb, didDocFromValidatedEvents = validateEvents) {
    this.db = db
    this.resolveImplementation = new Resolver(getResolver({
      dbInstance: db,
      validateEvents: didDocFromValidatedEvents
    })).resolve
  }

  async resolve(did: string) {
    const jsonDidDoc = await this.resolveImplementation(did)
      .catch(_ => {
        throw new Error(ErrorCodes.RegistryDIDNotAnchored)
      })

    return Identity.fromDidDocument({
      //@ts-ignore
      didDocument: DidDocument.fromJSON(jsonDidDoc)
    })
  }
}
