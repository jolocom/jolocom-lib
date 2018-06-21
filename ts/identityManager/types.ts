import { IKeyResponse } from '../utils/keyDerivation'
import { IKeyDerivationSchema } from './identityManager';

export interface IIdentityManager {
  deriveChildKeys: (path: string) => IKeyResponse
  getSchema: () => IKeyDerivationSchema
  addSchemaEntry: ({name, path}: {name: string, path: string}) => void
}
