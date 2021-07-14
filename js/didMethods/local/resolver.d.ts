import { IResolver } from '../types';
import { Identity } from '../../identity/identity';
import { InternalDb } from '@jolocom/local-resolver-registrar/js/db';
export declare class LocalResolver implements IResolver {
    prefix: string;
    db: InternalDb;
    private resolveImplementation;
    constructor(db: InternalDb, didDocFromValidatedEvents?: (events: string) => Promise<string>);
    resolve(did: string): Promise<Identity>;
}
