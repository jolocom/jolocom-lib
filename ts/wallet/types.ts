import { keyTypes } from '..'

export interface IPrivateKey {
  privateKey: Buffer
  path: keyTypes | string
  id: string
}
