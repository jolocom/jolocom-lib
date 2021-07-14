import { ILinkedDataSignature } from '@jolocom/protocol-ts'
import { ChainedSignature } from '.'

export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'

export type ProofChainsMap = { [keyId: string]: ILinkedDataSignature[] }
