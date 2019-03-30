import {IContractHandler, SupportedTxTypes} from './types'

/**
 * @class
 * Class abstracting assembling and parsing transactions for interaction with smart contracts
 * @internal
 */

export class ContractHandler implements IContractHandler {
  assembleTransaction: (txType: SupportedTxTypes) => {}
}


