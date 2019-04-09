import {IContractsAdapter, ITransactionEncodable} from './types'
import * as Transaction from 'ethereumjs-tx'
import {IVaultedKeyProvider, KeyTypes} from '../vaultedKeyProvider/types'

/**
 * @class
 * Class abstracting assembling and parsing transactions for interaction with smart contracts
 * @internal
 */

export class ContractsAdapter implements IContractsAdapter {
  private readonly chainId: number

  /**
   * @constructor
   * @param chainId - networkID corresponding to the used chain, as defined by EIP-155
   */

  constructor(chainId: number = 0) {
    this.chainId = chainId
  }

  /**
   * Assemble a Ethereum transaction given a interaction token
   * @param transactionOptions - Transaction info from the interaction token, e.g. a {@link PaymentRequest}
   * @param from - The address of the sender
   * @param nonce - Valid nonce to include in ethereum transaction
   * @param  vault - Vaulted key store for generating signatures
   * @param password - Password to decrypt the vaulted seed
   * @example `ethGateway.assembleTxFromInteractionToken(paymentReq.interactionToken, '0xaa..ff', 1, vault, 'secret')` // '0xabc...'
   */

  public assembleTxFromInteractionToken({transactionOptions}: ITransactionEncodable, from: string, nonce: number, vault: IVaultedKeyProvider, password: string) {
    const { to, value, gasPrice, gasLimit } = transactionOptions

    const tx = new Transaction({
      nonce,
      from,
      value,
      to,
      chainId: this.chainId,
      gasLimit,
      gasPrice
    })

    const privateKey = vault.getPrivateKey({
      derivationPath: KeyTypes.ethereumKey,
      encryptionPass: password
    })

    tx.sign(privateKey)

    return `0x${tx.serialize().toString('hex')}`
  }
}

export const jolocomContractsAdapter = new ContractsAdapter(4)
