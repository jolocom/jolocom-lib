import { IResolver } from "../types";
import { Identity } from "../../identity/identity";
import { InternalDb } from 'local-did-resolver/js/db';
export declare class LocalResolver implements IResolver {
    prefix: 'jolo';
    db: InternalDb;
    private resolveImplementation;
    constructor(db: InternalDb, didDocFromValidatedEvents?: (events: string) => Promise<string>);
    resolve(did: string): Promise<Identity>;
}
