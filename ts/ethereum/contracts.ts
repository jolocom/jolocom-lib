import {IContractHandler, ITransactionEncodable} from './types'
import * as Transaction from 'ethereumjs-tx'
import {IVaultedKeyProvider, KeyTypes} from '../vaultedKeyProvider/types'

/**
 * @class
 * Class abstracting assembling and parsing transactions for interaction with smart contracts
 * @internal
 */

export class ContractHandler implements IContractHandler {
  private readonly chainId: number

  constructor(chainId: number) {
    this.chainId = chainId
  }

  public assembleTransaction({transactionOptions}: ITransactionEncodable, from: string, nonce: number, vault: IVaultedKeyProvider, password: string) {
    const {receiverAddress, amountInWei} = transactionOptions

    const tx = new Transaction({
      nonce,
      from,
      value: amountInWei,
      chainId: this.chainId,
      gasLimit: 21000,
      gasPrice: 10e9,
      to: receiverAddress
    }) // TODO From the payload of tx

    const privateKey = vault.getPrivateKey({
      derivationPath: KeyTypes.ethereumKey,
      encryptionPass: password
    })

    tx.sign(privateKey)

    return `0x${tx.serialize().toString('hex')}`
  }
}

export const jolocomContractHandler = new ContractHandler(4)
